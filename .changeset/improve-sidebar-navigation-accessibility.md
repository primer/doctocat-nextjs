---
"@primer/doctocat-nextjs": patch
---

Improve screen reader accessibility by updating sidebar navigation heading hierarchy. The sidebar title now uses a semantic `<Heading>` component with visually hidden text to clarify it's a navigation area, and is properly connected to the `<NavList>` via `aria-labelledby`.
