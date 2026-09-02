# Doctocat authoring guide

## Project structure

- Put documentation in `content/`. An `index.mdx` file represents its directory route; for example, `content/guides/index.mdx` becomes `/guides/`.
- Put static assets in `public/`. Reference them with root-relative paths such as `/images/example.png`; Doctocat applies the configured base path.
- Keep `app/[[...mdxPath]]/page.tsx`, `app/layout.tsx`, `mdx-components.js`, and `next.config.ts` in place. They connect content to Doctocat routing and theming.

## Pages and navigation

- Every page must begin with frontmatter containing `title` and `description`.
- Use `menu-position` to control navigation order. Use nested content directories to create nested routes and navigation groups.
- Use root-relative links for internal pages, such as `[Get started](/getting-started/)`. Keep trailing slashes for static-host compatibility.
- Customize the homepage in `content/index.mdx`. It can contain Markdown, MDX, and imported components without replacing the root layout.

## Components

- Doctocat MDX components include `Article`, `Caption`, `CodeBlock`, `Do`, `Dont`, `DoDontContainer`, `HeadingLink`, `Note`, `PropTableValues`, `TableOfContents`, and `TableWrapper`.
- Primer components exposed by Doctocat include `Box`, `Button`, `Heading`, `Label`, `Stack`, and `Text`.
- Extend `mdx-components.js` when a project needs additional components. Preserve the existing Doctocat mappings.

## Validation and static export

- Run `npm run dev` for interactive local authoring.
- Run `npm run check` for TypeScript validation.
- Run `npm run build` for the deterministic static export and `.doctocat/build-manifest.json`.
- Static exports require a known route at build time. Do not add request-time server features, dynamic APIs, or image optimization.
- Keep internal links and public asset paths base-path aware. Test nested pages with direct loads and refreshes on the target static host.
- Do not replace Doctocat routing or its theme with hand-built copies. Customize through content, MDX components, and supported Doctocat configuration.
