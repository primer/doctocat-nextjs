# @primer/doctocat-nextjs

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
