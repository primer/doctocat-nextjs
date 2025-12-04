---
'@primer/doctocat-nextjs': minor
---

Add React 19 support

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
