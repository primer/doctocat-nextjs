---
'@primer/doctocat-nextjs': minor
'doctocat-nextjs-site': minor
---

- Aribitrary links can now be added to the sidebar and header using the `Theme` component's `headerLinks` and `sidebarLinks` props.
- Updated the header navigation to more closely visually align it with the existing Primer docs navigation.
- Removed `_meta.global.ts` and instead directly pass header and sidebar links into the doctocat `Theme` component.
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
