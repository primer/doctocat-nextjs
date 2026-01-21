# @primer/doctocat-nextjs

## 0.8.1

### Patch Changes

- [#83](https://github.com/primer/doctocat-nextjs/pull/83) [`3c3b1a9`](https://github.com/primer/doctocat-nextjs/commit/3c3b1a95ff8a301ea81b67f393aad7a0d4ab52f9) Thanks [@danielguillan](https://github.com/danielguillan)! - Remove underlines from header links

- [#80](https://github.com/primer/doctocat-nextjs/pull/80) [`772d8de`](https://github.com/primer/doctocat-nextjs/commit/772d8de1b580f7158262f313952227e282035003) Thanks [@danielguillan](https://github.com/danielguillan)! - Improves accessibility of anchor links by adding an underline

## 0.8.0

### Minor Changes

- [#73](https://github.com/primer/doctocat-nextjs/pull/73) [`a06099d`](https://github.com/primer/doctocat-nextjs/commit/a06099d65d36bdb361fc9a20b2b811990bb6d353) Thanks [@danielguillan](https://github.com/danielguillan)! - Add React 19 support

  This update is backwards compatible with React 18. However, it upgrades `@primer/react` to v38, which includes breaking changes such as the removal of the `Box` component and `sx` prop. Projects using this theme may need to update their code accordingly.
  - Updated React peer dependency to support React 19
  - Updated @primer/react from v37.11.2 to v38.3.0
  - Updated `@primer/react-brand` from v0.54.0 to v0.60.1
  - Updated `framer-motion` from v12.4.0 to v12.23.24
  - Updated `react-focus-on` from v3.9.4 to v3.10.0
  - Migrated `Label` components to `Token` for React 19 compatibility
  - Fixed type errors in `ReactCodeBlock` and `getRelatedPages` for stricter React 19 types
  - Added explicit `as="button"` to `IconButton` and `as="input"` to `TextInput` components
  - Updated Next.js and related packages from v15.5.2 to v15.5.7

### Patch Changes

- [#68](https://github.com/primer/doctocat-nextjs/pull/68) [`b75584e`](https://github.com/primer/doctocat-nextjs/commit/b75584edb6936a70ea94925fc743989422cc3d9a) Thanks [@janmaarten-a11y](https://github.com/janmaarten-a11y)! - Improve screen reader accessibility by updating sidebar navigation heading hierarchy. The sidebar title now uses a semantic `<Heading>` component with visually hidden text to clarify it's a navigation area, and is properly connected to the `<NavList>` via `aria-labelledby`.

## 0.7.0

### Minor Changes

- [#65](https://github.com/primer/doctocat-nextjs/pull/65) [`dc680ec`](https://github.com/primer/doctocat-nextjs/commit/dc680ec51605bd7a40dedc71cd3bb107632035dd) Thanks [@rezrah](https://github.com/rezrah)! - Updated Next.js compatibility to v15.5.x, Nextra to v4, and fix React code block rendering
  - **Next.js v15.5.2**: Upgraded to latest stable version across all workspaces
  - **Nextra v4 compatibility**: Updated type definitions for `ReactNode` titles
  - **Fixed code block rendering**: Added client-side rendering for interactive code examples to handle React lazy components properly

    Next.js v15.4+ changed how lazy components render on the server, breaking interactive code blocks. This update uses client-side code snippet extraction to convert lazy components to clean code strings for the live editor, preventing hydration mismatches and preserving existing behavior.

  - **Improved 404 page experience**: New 404 page to replace default Next.js version. Also removed stray 0 in top-left.

## 0.6.0

### Minor Changes

- [#63](https://github.com/primer/doctocat-nextjs/pull/63) [`9a090ee`](https://github.com/primer/doctocat-nextjs/commit/9a090eec47c64dc46f8eac14ec00548d421e8019) Thanks [@rezrah](https://github.com/rezrah)! - Moves `@primer/react-brand` to a peer-dependency.

  This change prevents a mismatch of versions between Doctocat and the project using it. Going forward, the latter will be preferred.

## 0.5.8

### Patch Changes

- [#59](https://github.com/primer/doctocat-nextjs/pull/59) [`c24a5b9`](https://github.com/primer/doctocat-nextjs/commit/c24a5b98aad639b42213ad230d923907115eb864) Thanks [@danielguillan](https://github.com/danielguillan)! - Switched sidebar navigation and content document order for improved accessibility

- [#61](https://github.com/primer/doctocat-nextjs/pull/61) [`1446089`](https://github.com/primer/doctocat-nextjs/commit/14460897dbcd248f688c13b9085128707abbda25) Thanks [@rezrah](https://github.com/rezrah)! - React code previews now support dot-notation in component names. E.g. Hero.Image.

## 0.5.7

### Patch Changes

- [`ba3188c`](https://github.com/primer/doctocat-nextjs/commit/ba3188cfc115d9a2e6d4b7402c20240f518eacd5) Thanks [@rezrah](https://github.com/rezrah)! - Switch to using native <a> instead of <Link> for header URLs, which prevents prefetching-related errors.

## 0.5.6

### Patch Changes

- [#56](https://github.com/primer/doctocat-nextjs/pull/56) [`e6a55fa`](https://github.com/primer/doctocat-nextjs/commit/e6a55fab3eb3fd56cbb20fe85a31751e6c227fc5) Thanks [@danielguillan](https://github.com/danielguillan)! - Updated theme switcher aria label

- [#54](https://github.com/primer/doctocat-nextjs/pull/54) [`a57f42f`](https://github.com/primer/doctocat-nextjs/commit/a57f42fec69d142e4dd1dc33129ce2423651e907) Thanks [@danielguillan](https://github.com/danielguillan)! - Fixed a bug that caused breadcrumbs to display an incorrect title for pages with tabs

## 0.5.5

### Patch Changes

- [#52](https://github.com/primer/doctocat-nextjs/pull/52) [`dd67040`](https://github.com/primer/doctocat-nextjs/commit/dd670402d0c6f59ea919a741a1925ce72a5d966a) Thanks [@danielguillan](https://github.com/danielguillan)! - Fixes breadcrumbs with duplicate and missing items

## 0.5.4

### Patch Changes

- [#51](https://github.com/primer/doctocat-nextjs/pull/51) [`4c76c4f`](https://github.com/primer/doctocat-nextjs/commit/4c76c4f5ccd248ec7d1f448c054808287a3ff51d) Thanks [@rezrah](https://github.com/rezrah)! - Add auto-collapsed React code blocks for large code snippets. This feature only applies to code fences with the `jsx live` language identifiers.

  E.g.

  ```jsx live
  <>Your code</>
  ```

- [#48](https://github.com/primer/doctocat-nextjs/pull/48) [`ce73c24`](https://github.com/primer/doctocat-nextjs/commit/ce73c24b2e4e924667bf7446a504bd88d8f2ccf0) Thanks [@rezrah](https://github.com/rezrah)! - - Fix inline code font-size in markdown headings. Now inherits size used in the heading.
  - Increased spacing below React code blocks, which was previously too small.

- [#50](https://github.com/primer/doctocat-nextjs/pull/50) [`5d67989`](https://github.com/primer/doctocat-nextjs/commit/5d679895408c1a58342419692db4234dfddefd80) Thanks [@rezrah](https://github.com/rezrah)! - Add `menu-position` frontmatter support for custom sidebar navigation ordering

## 0.5.3

### Patch Changes

- [#43](https://github.com/primer/doctocat-nextjs/pull/43) [`1b15bdf`](https://github.com/primer/doctocat-nextjs/commit/1b15bdfcf4b54996f38d20f1da711def23c636bd) Thanks [@rezrah](https://github.com/rezrah)! - Fix lack of `basePath` support on index cards. `href` now prepends the `basePath`.

- [#46](https://github.com/primer/doctocat-nextjs/pull/46) [`2b99ba6`](https://github.com/primer/doctocat-nextjs/commit/2b99ba614d1bfe8f1c478b10a61c52df479901c9) Thanks [@rezrah](https://github.com/rezrah)! - Prepend `basePath` from `next.config.js` to paths in Doctocat UI components, where it would previously not resolve correctly.

## 0.5.2

### Patch Changes

- [#41](https://github.com/primer/doctocat-nextjs/pull/41) [`e1ffb3a`](https://github.com/primer/doctocat-nextjs/commit/e1ffb3a630c51316a19e25869f731b4ef3660d2b) Thanks [@danielguillan](https://github.com/danielguillan)! - - Updated sidebar styles.
  - Added active header link as sidebar heading.
  - Made active header the root item of breadcrumbs, if available.
  - Made sidebar group headlines link to the index page.

- [#39](https://github.com/primer/doctocat-nextjs/pull/39) [`9090a35`](https://github.com/primer/doctocat-nextjs/commit/9090a3516de8657321ff2217e944cca6466ec9a0) Thanks [@danielguillan](https://github.com/danielguillan)! - Updated index pages to use a grid of Cards with thumbnails.

  Use `thumbnail` and `thumbnail_darkMode` to set custom thumbnail URLs for light and dark color modes respectively.

- [#38](https://github.com/primer/doctocat-nextjs/pull/38) [`e950c9a`](https://github.com/primer/doctocat-nextjs/commit/e950c9af9ad410025437510113172e207e2e30a2) Thanks [@danielguillan](https://github.com/danielguillan)! - Updated Primer Brand library to `v0.54.0`

- [#42](https://github.com/primer/doctocat-nextjs/pull/42) [`c9c2d16`](https://github.com/primer/doctocat-nextjs/commit/c9c2d16aa12ad56c71ec5ddbc008a028a378d81d) Thanks [@rezrah](https://github.com/rezrah)! - Added placeholder images to the Index page cards, where `thumbnail` and `thumbnail_darkMode` aren't provided through the frontmatter

## 0.5.1

### Patch Changes

- [#35](https://github.com/primer/doctocat-nextjs/pull/35) [`d0c5bd4`](https://github.com/primer/doctocat-nextjs/commit/d0c5bd40829c417b610682049e4b5bd59b3f87f0) Thanks [@rezrah](https://github.com/rezrah)! - Enable support for `trailingSlash: true` in `next.config.js`

## 0.5.0

### Minor Changes

- [#30](https://github.com/primer/doctocat-nextjs/pull/30) [`cdcb65e`](https://github.com/primer/doctocat-nextjs/commit/cdcb65e087d647a6d61c87d9122f105dcda64e35) Thanks [@joshfarrant](https://github.com/joshfarrant)! - - Arbitrary links can now be added to the sidebar and header using the `Theme` component's `headerLinks` and `sidebarLinks` props.
  - Updated the header navigation to more closely visually align it with the existing Primer docs navigation.
  - Removed `_meta.global.ts` and instead directly pass header and sidebar links into the Doctocat `Theme` component.

    ```diff
    - // _meta.global.ts
    - export default {
    -   type: 'page',
    -   href: 'https://github.com/primer/doctocat-nextjs',
    -   title: 'Doctocat',
    - }
    ```

    ```diff
    + // app/layout.tsx
    +
    + const sidebarLinks: ThemeProps['sidebarLinks'] = [
    +   {
    +     href: 'https://github.com/',
    +     title: 'GitHub',
    +     isExternal: true,
    +   },
    + ]
    +
    + <Theme sidebarLinks={sidebarLinks} {...rest} />
    ```

### Patch Changes

- [#34](https://github.com/primer/doctocat-nextjs/pull/34) [`ccf198c`](https://github.com/primer/doctocat-nextjs/commit/ccf198cca25b1f021c5ae78b8e2760c141a77dcc) Thanks [@rezrah](https://github.com/rezrah)! - Collection of UI bugfixes:
  - Sidebar offset added to prevent links being trapped under fixed header
  - Narrow viewport overflow bug fixed
  - Table of contents presentation fixed on narrow viewport, and has improved presentation on wider breakpoints.
  - Frontmatter metadata presentation now fixed on narrow viewport
  - OS scrollbar in dark color mode now respects color scheme
  - Inverted margin spacing in markdown content to use `margin-block-end` instead of `margin-block-start` to fix inconsistent spacing

## 0.4.1

### Patch Changes

- [#28](https://github.com/primer/doctocat-nextjs/pull/28) [`ef80501`](https://github.com/primer/doctocat-nextjs/commit/ef805016a05b059ab3da2f547f89dfc3cc9f0e09) Thanks [@rezrah](https://github.com/rezrah)! - Fixed a bug where a tabs were required in standalone, nested pages using filename `index.mdx`.

  Use `show-tabs: false` in frontmatter to disable the tabs and present content as normal.

## 0.4.0

### Minor Changes

- [#25](https://github.com/primer/doctocat-nextjs/pull/25) [`fd2d9a1`](https://github.com/primer/doctocat-nextjs/commit/fd2d9a1ffde630fd8c8548f6bdf30d8d7a07faaa) Thanks [@danielguillan](https://github.com/danielguillan)! - Add a `Note` component to display informative and warning messages.

  E.g.

  <pre>
  ```jsx
  <Note variant="warning">Your note content here</Note>
  ```
  </pre>

## 0.3.0

### Minor Changes

- [#22](https://github.com/primer/doctocat-nextjs/pull/22) [`2b57bc4`](https://github.com/primer/doctocat-nextjs/commit/2b57bc456efc03c99255ca90098ca3e035da1206) Thanks [@rezrah](https://github.com/rezrah)! - Add live code editing and previews for `jsx` code blocks in Markdown. All other code blocks will continue to render as normal.

  E.g.

  <pre>
  ```jsx
  <p>Your React code here</p>
  ```
  </pre>

## 0.2.0

### Minor Changes

- [#20](https://github.com/primer/doctocat-nextjs/pull/20) [`be8bc6a`](https://github.com/primer/doctocat-nextjs/commit/be8bc6af733ba40bdd4393b876b2653017d7e846) Thanks [@rezrah](https://github.com/rezrah)! - Dropped support for Next.js Pages router in favor of App Router + Nextra v4
  - [Read the migration guide from `v0.1.0` to `v0.2.0`](https://github.com/primer/doctocat-nextjs/blob/main/migration-guides/v0.2.0-app-router.md)

## 0.1.0

### Minor Changes

- [#18](https://github.com/primer/doctocat-nextjs/pull/18) [`bfe68b1`](https://github.com/primer/doctocat-nextjs/commit/bfe68b14e8e3b4383ea41dcbf47373df8a130567) Thanks [@rezrah](https://github.com/rezrah)! - Upgraded internal framework to [Nextra v3](https://the-guild.dev/blog/nextra-3).

  To migrate Doctocat to this release, follow these steps:
  1. Install the latest version `npm i @primer/doctocat-nextjs@0.1.0`
  2. Rename your `next.config.js` to be `next.config.mjs`. Add `type="module"` to your `package.json` and update the file contents to match the following:

  ```diff
  -  const withDoctocat = require('@primer/doctocat-nextjs/doctocat.config.js')

  -  module.exports = {
  -  ...withDoctocat({

  -  }),
  -  }

  +  import withDoctocat from '@primer/doctocat-nextjs/doctocat.config.js'

  +  export default {
  +  ...withDoctocat({

  +  }),
  +  }

  ```

## 0.0.4

### Patch Changes

- [#8](https://github.com/primer/doctocat-nextjs/pull/8) [`fd7f838`](https://github.com/primer/doctocat-nextjs/commit/fd7f83883152512b34dd7601346c03fe53e3ffb3) Thanks [@rezrah](https://github.com/rezrah)! - Added OpenGraph tags for improved social sharing experience.

- [#8](https://github.com/primer/doctocat-nextjs/pull/8) [`0d0879b`](https://github.com/primer/doctocat-nextjs/commit/0d0879b8e732e74a50861e22a0ff534d0e191a45) Thanks [@rezrah](https://github.com/rezrah)! - Enabled related content navigation using `keywords` and `related` properties in Markdown frontmatter.

  Example:

  ```
  ---
  title: Page A
  keywords: ['keyword', 'another keyword']
  ---
  ```

  ```
  ---
  title: Page B
  keywords: ['keyword', 'another keyword']
  ---
  ```

  The matching keyword values above across both pages, will enable automatic related content navigation between the two pages.

  or using the `related` property:

  ```
  ---
  related: [{title: External link example, href: https://example.com}]
  ---
  ```

- [#8](https://github.com/primer/doctocat-nextjs/pull/8) [`fd7f838`](https://github.com/primer/doctocat-nextjs/commit/fd7f83883152512b34dd7601346c03fe53e3ffb3) Thanks [@rezrah](https://github.com/rezrah)! - Fixed accessibility violations arising from duplicate landmarks and missing aria labels.

## 0.0.3

### Patch Changes

- [`937f773`](https://github.com/primer/doctocat-nextjs/commit/937f77385bc6c4d2c6289d0a6f12122373789f73) Thanks [@rezrah](https://github.com/rezrah)! - Redesign index pages to match current Doctocat styles

- [`7703a7b`](https://github.com/primer/doctocat-nextjs/commit/7703a7b86bc906ff981a7f864a9916c963a35087) Thanks [@rezrah](https://github.com/rezrah)! - Fixed code bg in dark mode and applied fixed width to toc to prevent layout shift

## 0.0.2

### Patch Changes

- [#4](https://github.com/primer/doctocat-nextjs/pull/4) [`4f28982`](https://github.com/primer/doctocat-nextjs/commit/4f28982e327e75f199f28fad987f1e827deafeb2) Thanks [@joseph-lozano](https://github.com/joseph-lozano)! - Wrap links with Next's Link component

- [`6f21970`](https://github.com/primer/doctocat-nextjs/commit/6f21970c74f7635be89fc4cd20376d7fe5ca35e7) Thanks [@rezrah](https://github.com/rezrah)! - Switch hero image order with description and reduce `h2` block start margin

- [#6](https://github.com/primer/doctocat-nextjs/pull/6) [`afd4e17`](https://github.com/primer/doctocat-nextjs/commit/afd4e1762f6294a14942d415c693319a874cd3fb) Thanks [@rezrah](https://github.com/rezrah)! - - Add MDX to HTML overrides mechanism and apply to headings and anchors
  - Added anchor links to headings to match current functionality on primer.style

- [`b49f218`](https://github.com/primer/doctocat-nextjs/commit/b49f218e9bbc2de720476e21888956bee6081967) Thanks [@rezrah](https://github.com/rezrah)! - Removed sidebar links and added skip to main content a11y link

- [#2](https://github.com/primer/doctocat-nextjs/pull/2) [`2742b32`](https://github.com/primer/doctocat-nextjs/commit/2742b3214e7a53416d23f0459dc389f7c22cf5a1) Thanks [@rezrah](https://github.com/rezrah)! - Remove code blocks stylesheet, now merged into global.css
