# Changelog

## [2.25.0](https://github.com/mdn/yari/compare/v2.24.0...v2.25.0) (2023-06-06)


### Features

* **client/env:** split CRUD_MODE into WRITER_MODE and DEV_MODE ([#8383](https://github.com/mdn/yari/issues/8383)) ([675a854](https://github.com/mdn/yari/commit/675a854205c05576eb34b85f813577d6bd1106f0))

## [2.24.0](https://github.com/mdn/yari/compare/v2.23.1...v2.24.0) (2023-06-05)


### Features

* **docs:** allow audio (mp3/ogg), video (mp4/webm) and font (woff2) attachments ([#7605](https://github.com/mdn/yari/issues/7605)) ([73f8dbc](https://github.com/mdn/yari/commit/73f8dbc6c8baf66a116225cae29c19e80d5b6b4a))
* **macros:** add GlossarySidebar macro ([#8997](https://github.com/mdn/yari/issues/8997)) ([e704315](https://github.com/mdn/yari/commit/e7043154bf532cb1a81f1857ba9b4b9f80250498))
* **macros:** add XsltSidebar for XSLT pages ([#9021](https://github.com/mdn/yari/issues/9021)) ([bddd9f7](https://github.com/mdn/yari/commit/bddd9f7eb1bb3e545b16eb68b62d644909fb68d4))
* **placement:** hp takeover ([#9022](https://github.com/mdn/yari/issues/9022)) ([2ff4a7b](https://github.com/mdn/yari/commit/2ff4a7b11475d8dac0a072475d5cd08a99d558a4))
* pride month 2023 ([#8979](https://github.com/mdn/yari/issues/8979)) ([776e70a](https://github.com/mdn/yari/commit/776e70a2085252c155596df4a5b79a170e506319))


### Bug Fixes

* **constants:** add Polish to RETIRED_LOCALES ([#8970](https://github.com/mdn/yari/issues/8970)) ([08c15a3](https://github.com/mdn/yari/commit/08c15a3c33ac1eb4801a8b478cb1e99548a9ecab))
* **toolbar:** reduce height if read-only ([#8976](https://github.com/mdn/yari/issues/8976)) ([9e91c72](https://github.com/mdn/yari/commit/9e91c723a088cbfd8ab9bc148aae4a907a80baa5))

## [2.23.1](https://github.com/mdn/yari/compare/v2.23.0...v2.23.1) (2023-05-29)


### Bug Fixes

* **kumascript:** mention path in render error message ([#8936](https://github.com/mdn/yari/issues/8936)) ([27938ad](https://github.com/mdn/yari/commit/27938adc275d599363b09d526395ab7c739d025b))
* **kumascript:** mention path in render error message (v2) ([#8953](https://github.com/mdn/yari/issues/8953)) ([a9d7370](https://github.com/mdn/yari/commit/a9d737026ac159458a18ed261321e14751aff382))

## [2.23.0](https://github.com/mdn/yari/compare/v2.22.0...v2.23.0) (2023-05-25)


### Features

* **newsletter:** add public sign-up page ([#8686](https://github.com/mdn/yari/issues/8686)) ([bf3fbf7](https://github.com/mdn/yari/commit/bf3fbf70d0487fb6cb66026bcf9a9942bb64e63a))


### Bug Fixes

* **cloud-function:** strip X-Forwarded-Host + Forwarded headers ([#8894](https://github.com/mdn/yari/issues/8894)) ([74bab35](https://github.com/mdn/yari/commit/74bab354a076ad044d909b30991784cd163ace1a))
* **csp,fundamental-redirects:** replace media.*.mdn.mozit.cloud with mdn.dev ([#8873](https://github.com/mdn/yari/issues/8873)) ([2c81bf5](https://github.com/mdn/yari/commit/2c81bf58e0ab533960b716f00d6e5b43f4d46dd0))
* **quicksearch:** opened pages don't scroll to top ([#8911](https://github.com/mdn/yari/issues/8911)) ([964251b](https://github.com/mdn/yari/commit/964251b2fa54532eae121f61e57700378e920d25))

## [2.22.0](https://github.com/mdn/yari/compare/v2.21.0...v2.22.0) (2023-05-19)


### Features

* **syntax-highlight:** add apacheconf to Prism.js languages ([#8862](https://github.com/mdn/yari/issues/8862)) ([8b8ae3d](https://github.com/mdn/yari/commit/8b8ae3d1e7e5ec63599946a1ad8a699d93a7ffa0))


### Bug Fixes

* **blog:** hydration error on date ([#8871](https://github.com/mdn/yari/issues/8871)) ([a271858](https://github.com/mdn/yari/commit/a271858662aef8963ca4a5826636d077db5431c8))
* **content:** only collect required translations ([#8806](https://github.com/mdn/yari/issues/8806)) ([5ec562c](https://github.com/mdn/yari/commit/5ec562cd2d59d0fd0e4f5d3cb8ac48e2a4985274))
* **sidebar:** incorrect offset and z-index on mobile ([#8856](https://github.com/mdn/yari/issues/8856)) ([af1cfdc](https://github.com/mdn/yari/commit/af1cfdc4b728a85df9263986809dbd3df1a37f14))
* **top-banner:** adjust width ([#8863](https://github.com/mdn/yari/issues/8863)) ([f5c6dbc](https://github.com/mdn/yari/commit/f5c6dbc5f674a5c4967aa331c88d01abe74c0f94))
* **ui:** gap at top of page in tablet mode ([#8885](https://github.com/mdn/yari/issues/8885)) ([dd98b12](https://github.com/mdn/yari/commit/dd98b127bdc8ce655a38ba4db37343af86345f9d))
* **workflows:** rate limit downloading ripgrep ([#8865](https://github.com/mdn/yari/issues/8865)) ([6187817](https://github.com/mdn/yari/commit/61878177d153cf17c8d968ed4de953bc4a81589e))

## [2.21.0](https://github.com/mdn/yari/compare/v2.20.3...v2.21.0) (2023-05-15)


### Features

* **build:** collect errors + warnings with @sentry/node ([#8571](https://github.com/mdn/yari/issues/8571)) ([f18d609](https://github.com/mdn/yari/commit/f18d609c6ddfda87efca707234f9d4a6c49798df))
* **ci:** add xyz-build ([#8661](https://github.com/mdn/yari/issues/8661)) ([77df4fc](https://github.com/mdn/yari/commit/77df4fc754464e4ba241589d8f5f21d0a9dc8a23))


### Bug Fixes

* avoid leading double slash ([#8846](https://github.com/mdn/yari/issues/8846)) ([0fb0fa9](https://github.com/mdn/yari/commit/0fb0fa9008d8e866367a37288050ca1e40be443a))
* **CSS:** last elements inside blockquotes do not need bottom margin ([#8855](https://github.com/mdn/yari/issues/8855)) ([80094ea](https://github.com/mdn/yari/commit/80094ea5054fec899b15a2d4e2310053eac542eb))
* **macros/PWASidebar:** remove structural overview page ([#8845](https://github.com/mdn/yari/issues/8845)) ([93ac66f](https://github.com/mdn/yari/commit/93ac66fb39b7614c8f33f16a8dd4a84026acaa70))

## [2.20.3](https://github.com/mdn/yari/compare/v2.20.2...v2.20.3) (2023-05-11)


### Bug Fixes

* **lint-staged:** use negative pattern correctly ([#8842](https://github.com/mdn/yari/issues/8842)) ([8e74e5f](https://github.com/mdn/yari/commit/8e74e5fb0518d8b140a41a965e71ab267e11bef5))
* **npm-publish:** setup node with registry url ([#8841](https://github.com/mdn/yari/issues/8841)) ([660a28b](https://github.com/mdn/yari/commit/660a28ba34772eba75a602de01a1fa2aa8865992))

## [2.20.2](https://github.com/mdn/yari/compare/v2.20.1...v2.20.2) (2023-05-11)


### Bug Fixes

* **npm-publish:** restore --access public option ([#8839](https://github.com/mdn/yari/issues/8839)) ([c5f8c48](https://github.com/mdn/yari/commit/c5f8c48ada5b17ef672810e09ca399ea518a46fa))

## [2.20.1](https://github.com/mdn/yari/compare/v2.20.0...v2.20.1) (2023-05-11)


### Bug Fixes

* **dev:** TypeScript errors when running `yarn dev` ([#8835](https://github.com/mdn/yari/issues/8835)) ([039515b](https://github.com/mdn/yari/commit/039515b730f6a636e0791e683604ae7fa8ad5072))
* **npm-publish:** revert renaming of NPM_AUTH_TOKEN ([#8831](https://github.com/mdn/yari/issues/8831)) ([3ccc923](https://github.com/mdn/yari/commit/3ccc923e6690fa81b08435cf6e4ca44812fd06a4))

## [2.20.0](https://github.com/mdn/yari/compare/v2.19.0...v2.20.0) (2023-05-10)


### Features

* **docs:** baseline indicator ([#8772](https://github.com/mdn/yari/issues/8772)) ([35786d8](https://github.com/mdn/yari/commit/35786d80399b225507530931286deaa55b0c9a82))

## [2.19.0](https://github.com/mdn/yari/compare/v2.18.1...v2.19.0) (2023-05-10)


### Features

* **banner:** add blog announcement banner ([#8801](https://github.com/mdn/yari/issues/8801)) ([2e730ae](https://github.com/mdn/yari/commit/2e730ae35c5634e10b3ab2202e605a6e4f09c647))
* **fundamental-redirects:** redirect archived media ([#8785](https://github.com/mdn/yari/issues/8785)) ([784beeb](https://github.com/mdn/yari/commit/784beeb2d7eda26c47528e58164693952d0c30db))


### Bug Fixes

* **blog:** add build step ([e1366c5](https://github.com/mdn/yari/commit/e1366c558cbb254d195a45d5605b632b63e24356))
* **ci:** limit failing CI from running on forks ([877d6fa](https://github.com/mdn/yari/commit/877d6fa3569a306fd8e76f2556cd3d3577f49953))
* **cloud-function:** fix fxa webhooks ([#8706](https://github.com/mdn/yari/issues/8706)) ([d6421a5](https://github.com/mdn/yari/commit/d6421a56c93655047a9c52205cdff1f675877f1f))
* **jest:** reduce memory usage ([#8753](https://github.com/mdn/yari/issues/8753)) ([47910ee](https://github.com/mdn/yari/commit/47910ee04e30ac129459a8c1628ac375518884c3))
* **jest:** use --rootDir option ([#8754](https://github.com/mdn/yari/issues/8754)) ([80f51f4](https://github.com/mdn/yari/commit/80f51f4a15680a0737b776d8ef5b6d630d634677))
* **layout:** consolidate sticky header ([#8781](https://github.com/mdn/yari/issues/8781)) ([496ab9f](https://github.com/mdn/yari/commit/496ab9f36773d86b6d8f7478deaa34e106353b88))
* **ssr:** add hreflang to alternate rss link ([#8756](https://github.com/mdn/yari/issues/8756)) ([f71415e](https://github.com/mdn/yari/commit/f71415ef6d3f22db9a74b33711133dfb440129f5))
* **sync:** don't deploy to static/static ([#8803](https://github.com/mdn/yari/issues/8803)) ([c453e79](https://github.com/mdn/yari/commit/c453e79f2cb922bf429a3caf2d553a2d353bb39b))
* **sync:** skip rsync for static ([#8805](https://github.com/mdn/yari/issues/8805)) ([8951f2a](https://github.com/mdn/yari/commit/8951f2a3af2b6ac19eff2a45aafc1bb7e029cdb2))
* tool `yarn content move` converts double quotes to single quotes in title ([#8623](https://github.com/mdn/yari/issues/8623)) ([7da24a4](https://github.com/mdn/yari/commit/7da24a408ae8ea628feaf7e55b18d6f32b6a39ad))
* Wrap SVG Mandala to reduce CPU usage ([#8622](https://github.com/mdn/yari/issues/8622)) ([35c9ae9](https://github.com/mdn/yari/commit/35c9ae91e548d417c836e437ecda3e8546888180))
