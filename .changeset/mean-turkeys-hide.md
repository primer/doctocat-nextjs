---
'@primer/doctocat-nextjs': patch
---

Enabled related content navigation using `keywords` field in Markdown frontmatter.

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
