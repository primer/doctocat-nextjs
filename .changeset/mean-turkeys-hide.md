---
'@primer/doctocat-nextjs': patch
---

Enabled related content navigation using `keywords` and `related` properties in Markdown frontmatter.

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
