---
'@primer/doctocat-nextjs': minor
---

Updated Next.js compatibility to v15.5.x, Nextra to v4, and fix React code block rendering

- **Next.js v15.5.2**: Upgraded to latest stable version across all workspaces
- **Nextra v4 compatibility**: Updated type definitions for `ReactNode` titles
- **Fixed code block rendering**: Added client-side rendering for interactive code examples to handle React lazy components properly

  Next.js v15.4+ changed how lazy components render on the server, breaking interactive code blocks. This update uses client-side code snippet extraction to convert lazy components to clean code strings for the live editor, preventing hydration mismatches and preserving existing behavior.

- **Improved 404 page experience**: New 404 page to replace default Next.js version. Also removed stray 0 in top-left.
