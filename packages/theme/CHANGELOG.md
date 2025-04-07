# @primer/doctocat-nextjs

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
