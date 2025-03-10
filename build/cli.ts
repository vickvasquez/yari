#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

import chalk from "chalk";
import cliProgress from "cli-progress";
import caporal from "@caporal/core";
import inquirer from "inquirer";

import { Document, slugToFolder, translationsOf } from "../content/index.js";
import {
  CONTENT_ROOT,
  CONTENT_TRANSLATED_ROOT,
  BUILD_OUT_ROOT,
  SENTRY_DSN_BUILD,
} from "../libs/env/index.js";
import { VALID_LOCALES } from "../libs/constants/index.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { renderHTML } from "../ssr/dist/main.js";
import options from "./build-options.js";
import {
  buildDocument,
  BuiltDocument,
  renderContributorsTxt,
} from "./index.js";
import { DocMetadata, Flaws } from "../libs/types/document.js";
import SearchIndex from "./search-index.js";
import { makeSitemapXML, makeSitemapIndexXML } from "./sitemaps.js";
import { humanFileSize } from "./utils.js";
import { initSentry } from "./sentry.js";

const { program } = caporal;
const { prompt } = inquirer;

export type DocumentBuild = SkippedDocumentBuild | InteractiveDocumentBuild;

export interface SkippedDocumentBuild {
  doc: Record<string, never>;
  skip: true;
}

export interface InteractiveDocumentBuild {
  document: any;
  doc: BuiltDocument;
  skip: false;
}

interface GlobalMetadata {
  [locale: string]: Array<DocMetadata>;
}

async function buildDocumentInteractive(
  documentPath: string,
  interactive: boolean,
  invalidate = false
): Promise<SkippedDocumentBuild | InteractiveDocumentBuild> {
  try {
    const document = invalidate
      ? Document.read(documentPath, Document.MEMOIZE_INVALIDATE)
      : Document.read(documentPath);

    if (!document) {
      throw new Error(`${documentPath} could not be read`);
    }

    if (!interactive) {
      document.translations = translationsOf(
        document.metadata.slug,
        document.metadata.locale
      );
    }

    return { document, doc: await buildDocument(document), skip: false };
  } catch (e) {
    if (!interactive) {
      throw e;
    }
    console.error(e);
    const { action } = await prompt([
      {
        type: "list",
        message: "What to do?",
        name: "action",
        choices: [
          { name: "re-run", value: "r" },
          { name: "skip", value: "s" },
          { name: "quit", value: "q" },
        ],
        default: "r",
      },
    ]);
    if (action === "r") {
      return await buildDocumentInteractive(documentPath, interactive, true);
    }
    if (action === "s") {
      return { doc: {}, skip: true };
    }
    throw e;
  }
}

export interface BuiltDocuments {
  slugPerLocale: Record<
    string,
    {
      slug: string;
      modified: string;
    }[]
  >;
  peakHeapBytes: number;
  totalFlaws: any;
}

async function buildDocuments(
  files: string[] = null,
  quiet = false,
  interactive = false,
  noHTML = false,
  locales: Map<string, string> = new Map()
): Promise<BuiltDocuments> {
  // If a list of files was set, it came from the CLI.
  // Override whatever was in the build options.
  const findAllOptions = {
    ...options,
    locales,
  };
  if (files) {
    findAllOptions.files = new Set(files);
  }

  const metadata: GlobalMetadata = {};

  const documents = await Document.findAll(findAllOptions);
  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_grey
  );

  const docPerLocale = {};
  const searchIndex = new SearchIndex();

  if (!documents.count) {
    throw new Error("No documents to build found");
  }

  let peakHeapBytes = 0;

  // For keeping track of the total counts of flaws
  const totalFlaws = new Map<string, number>();

  function appendTotalFlaws(flaws: Flaws) {
    for (const [key, actualFlaws] of Object.entries(flaws)) {
      const count = actualFlaws.length;
      if (!totalFlaws.has(key)) {
        totalFlaws.set(key, 0);
      }
      totalFlaws.set(key, (totalFlaws.get(key) as number) + count);
    }
  }

  if (!options.noProgressbar) {
    progressBar.start(documents.count, 0);
  }

  for (const documentPath of documents.iterPaths()) {
    const result = await buildDocumentInteractive(documentPath, interactive);

    const isSkippedDocumentBuild = (
      result: SkippedDocumentBuild | InteractiveDocumentBuild
    ): result is SkippedDocumentBuild => result.skip !== false;

    if (isSkippedDocumentBuild(result)) {
      continue;
    }

    const {
      doc: { doc: builtDocument, liveSamples, fileAttachments },
      document,
    } = result;

    const outPath = path.join(BUILD_OUT_ROOT, slugToFolder(document.url));
    fs.mkdirSync(outPath, { recursive: true });

    if (builtDocument.flaws) {
      appendTotalFlaws(builtDocument.flaws);
    }

    if (!noHTML) {
      fs.writeFileSync(
        path.join(outPath, "index.html"),
        renderHTML(document.url, { doc: builtDocument })
      );
    }

    // This is exploiting the fact that renderHTML has the side-effect of
    // mutating the built document which makes this not great and refactor-worthy.
    const docString = JSON.stringify({ doc: builtDocument });
    fs.writeFileSync(path.join(outPath, "index.json"), docString);
    fs.writeFileSync(
      path.join(outPath, "contributors.txt"),
      renderContributorsTxt(
        document.metadata.contributors,
        builtDocument.source.github_url.replace("/blob/", "/commits/")
      )
    );

    for (const { id, html } of liveSamples) {
      const liveSamplePath = path.join(outPath, `_sample_.${id}.html`);
      fs.writeFileSync(liveSamplePath, html);
    }

    for (const filePath of fileAttachments) {
      // We *could* use symlinks instead. But, there's no point :)
      // Yes, a symlink is less disk I/O but it's nominal.
      fs.copyFileSync(filePath, path.join(outPath, path.basename(filePath)));
    }

    // Collect active documents' slugs to be used in sitemap building and
    // search index building.
    if (!builtDocument.noIndexing) {
      const { locale, slug } = document.metadata;
      if (!docPerLocale[locale]) {
        docPerLocale[locale] = [];
      }
      docPerLocale[locale].push({
        slug,
        modified: document.metadata.modified,
      });

      searchIndex.add(document);
    }

    const hash = crypto.createHash("sha256").update(docString).digest("hex");
    const {
      body: _,
      toc: __,
      sidebarHTML: ___,
      sidebarMacro: ____,
      ...builtMetadata
    } = builtDocument;
    builtMetadata.hash = hash;

    fs.writeFileSync(
      path.join(outPath, "metadata.json"),
      JSON.stringify(builtMetadata)
    );
    if (metadata[document.metadata.locale]) {
      metadata[document.metadata.locale].push(builtMetadata);
    } else {
      metadata[document.metadata.locale] = [builtMetadata];
    }

    if (!options.noProgressbar) {
      progressBar.increment();
    } else if (!quiet) {
      console.log(outPath);
    }
    const heapBytes = process.memoryUsage().heapUsed;
    if (heapBytes > peakHeapBytes) {
      peakHeapBytes = heapBytes;
    }
  }

  if (!options.noProgressbar) {
    progressBar.stop();
  }

  for (const [locale, docs] of Object.entries(docPerLocale)) {
    const sitemapDir = path.join(
      BUILD_OUT_ROOT,
      "sitemaps",
      locale.toLowerCase()
    );
    fs.mkdirSync(sitemapDir, { recursive: true });
    const sitemapFilePath = path.join(sitemapDir, "sitemap.xml.gz");
    fs.writeFileSync(
      sitemapFilePath,
      zlib.gzipSync(makeSitemapXML(locale, docs))
    );
  }

  searchIndex.sort();
  for (const [locale, items] of Object.entries(searchIndex.getItems())) {
    fs.writeFileSync(
      path.join(BUILD_OUT_ROOT, locale.toLowerCase(), "search-index.json"),
      JSON.stringify(items)
    );
  }

  for (const [locale, meta] of Object.entries(metadata)) {
    fs.writeFileSync(
      path.join(BUILD_OUT_ROOT, locale.toLowerCase(), "metadata.json"),
      JSON.stringify(meta)
    );
  }

  const allBrowserCompat = new Set<string>();
  Object.values(metadata).forEach((localeMeta) =>
    localeMeta.forEach((doc) =>
      doc.browserCompat?.forEach((query) => allBrowserCompat.add(query))
    )
  );
  fs.writeFileSync(
    path.join(BUILD_OUT_ROOT, "allBrowserCompat.txt"),
    [...allBrowserCompat].join(" ")
  );

  return { slugPerLocale: docPerLocale, peakHeapBytes, totalFlaws };
}

function formatTotalFlaws(flawsCountMap, header = "Total_Flaws_Count") {
  if (!flawsCountMap.size) {
    return "";
  }
  const keys = [...flawsCountMap.keys()];
  const longestKey = Math.max(...keys.map((k) => k.length));
  const out = ["\n"];
  out.push(header);
  for (const key of keys.sort()) {
    out.push(
      `${key.padEnd(longestKey + 1)} ${flawsCountMap.get(key).toLocaleString()}`
    );
  }
  out.push("\n");
  return out.join("\n");
}

interface BuildArgsAndOptions {
  args: {
    files?: string[];
  };
  options: {
    quiet?: boolean;
    interactive?: boolean;
    nohtml?: boolean;
    locale?: string[];
    notLocale?: string[];
    sitemapIndex?: boolean;
  };
}

if (SENTRY_DSN_BUILD) {
  initSentry(SENTRY_DSN_BUILD);
}

program
  .name("build")
  .option("-i, --interactive", "Ask what to do when encountering flaws", {
    default: false,
  })
  .option("-n, --nohtml", "Do not build index.html", {
    default: false,
  })
  .option("-l, --locale <locale...>", "Filtered specific locales", {
    default: [],
    validator: [...VALID_LOCALES.keys()],
  })
  .option("--not-locale <locale...>", "Exclude specific locales", {
    default: [],
    validator: [...VALID_LOCALES.keys()],
  })
  .option("--sitemap-index", "Build a sitemap index file", {
    default: false,
  })
  .argument("[files...]", "specific files to build")
  .action(async ({ args, options }: BuildArgsAndOptions) => {
    try {
      if (!options.quiet) {
        const roots = [
          ["CONTENT_ROOT", CONTENT_ROOT],
          ["CONTENT_TRANSLATED_ROOT", CONTENT_TRANSLATED_ROOT],
        ];
        for (const [key, value] of roots) {
          console.log(
            `${chalk.grey((key + ":").padEnd(25, " "))}${
              value ? chalk.white(value) : chalk.grey("not set")
            }`
          );
        }
      }

      if (options.sitemapIndex) {
        if (!options.quiet) {
          console.log(chalk.yellow("Building sitemap index file..."));
        }
        const sitemapsBuilt = [];
        const locales = [];
        for (const locale of VALID_LOCALES.keys()) {
          const sitemapFilePath = path.join(
            BUILD_OUT_ROOT,
            "sitemaps",
            locale,
            "sitemap.xml.gz"
          );
          if (fs.existsSync(sitemapFilePath)) {
            sitemapsBuilt.push(sitemapFilePath);
            locales.push(locale);
          }
        }

        const sitemapIndexFilePath = path.join(BUILD_OUT_ROOT, "sitemap.xml");
        fs.writeFileSync(
          sitemapIndexFilePath,
          makeSitemapIndexXML(
            sitemapsBuilt.map((fp) => fp.replace(BUILD_OUT_ROOT, ""))
          )
        );

        if (!options.quiet) {
          console.log(
            chalk.green(
              `Sitemap index file built with locales: ${locales.join(", ")}.`
            )
          );
        }
        return;
      }
      const { files } = args;

      let locales = new Map();
      if (options.notLocale && options.notLocale.length > 0) {
        if (options.locale && options.locale.length) {
          throw new Error(
            "Can't use --not-locale and --locale at the same time"
          );
        }
        const notLocales = Array.isArray(options.notLocale)
          ? options.notLocale
          : [options.notLocale];

        locales = new Map(
          [...VALID_LOCALES.keys()]
            .filter((locale) => !notLocales.includes(locale))
            .map((locale) => [locale, true])
        );
      } else {
        // 'true' means we include this locale and all others get excluded.
        // Some day we might make it an option to set `--not-locale` to
        // filter out specific locales.
        locales = new Map(
          // The `options.locale` is either an empty array (e.g. no --locale used),
          // a string (e.g. one single --locale) or an array of strings
          // (e.g. multiple --locale options).
          (Array.isArray(options.locale)
            ? options.locale
            : [options.locale]
          ).map((locale) => [locale, true])
        );
      }

      const t0 = new Date();
      const { slugPerLocale, peakHeapBytes, totalFlaws } = await buildDocuments(
        files,
        Boolean(options.quiet),
        Boolean(options.interactive),
        Boolean(options.nohtml),
        locales
      );
      const t1 = new Date();
      const count = Object.values(slugPerLocale).reduce(
        (a, b) => a + b.length,
        0
      );
      const seconds = (t1.getTime() - t0.getTime()) / 1000;
      const took =
        seconds > 60
          ? `${(seconds / 60).toFixed(1)} minutes`
          : `${seconds.toFixed(1)} seconds`;
      if (!options.quiet) {
        console.log(
          chalk.green(
            `Built ${count.toLocaleString()} pages in ${took}, at a rate of ${(
              count / seconds
            ).toFixed(1)} documents per second.`
          )
        );
        if (locales.size) {
          console.log(
            chalk.yellow(
              `(only building locales: ${[...locales.keys()].join(", ")})`
            )
          );
        }
        console.log(`Peak heap memory usage: ${humanFileSize(peakHeapBytes)}`);
        console.log(formatTotalFlaws(totalFlaws));
      }
    } catch (error) {
      // So you get a stacktrace in the CLI output
      console.error(error);
      // So that the CLI ultimately fails
      throw error;
    }
  });

program.run();
