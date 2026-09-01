// @vitest-environment node

import {execFile} from 'node:child_process'
import {mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {promisify} from 'node:util'
import {afterAll, beforeAll, describe, expect, it} from 'vitest'

const execute = promisify(execFile)
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const npxExecutable = process.platform === 'win32' ? 'npx.cmd' : 'npx'

describe.sequential('doctocat-nextjs CLI', () => {
  let temporaryDirectory: string
  let tarballPath: string
  let projectDirectory: string

  beforeAll(async () => {
    temporaryDirectory = await mkdtemp(resolve(tmpdir(), 'doctocat-nextjs-'))
    const {stdout} = await execute(npmExecutable, ['pack', '--json', '--pack-destination', temporaryDirectory], {
      cwd: packageRoot,
      maxBuffer: 20 * 1024 * 1024,
    })
    const packResult = JSON.parse(stdout)[0]
    tarballPath = resolve(temporaryDirectory, packResult.filename)
    projectDirectory = resolve(temporaryDirectory, 'project')
  }, 120_000)

  afterAll(async () => {
    if (temporaryDirectory) await rm(temporaryDirectory, {recursive: true, force: true})
  }, 120_000)

  const executePackedCli = (args: string[], cwd = temporaryDirectory) =>
    execute(npxExecutable, ['--yes', `--package=${tarballPath}`, 'doctocat-nextjs', ...args], {
      cwd,
      maxBuffer: 20 * 1024 * 1024,
    })

  it('packs the executable and CLI scaffold resources', async () => {
    const {stdout} = await execute(npmExecutable, ['pack', '--json', '--dry-run'], {
      cwd: packageRoot,
      maxBuffer: 20 * 1024 * 1024,
    })
    const packedFiles = JSON.parse(stdout)[0].files.map((file: {path: string}) => file.path)

    expect(packedFiles).toContain('cli/index.mjs')
    expect(packedFiles).toContain('cli/.generated-scaffold/AGENTS.md')
    expect(packedFiles).toContain('cli/.generated-scaffold/gitignore.template')
    expect(packedFiles).toContain('cli/.generated-scaffold/app/layout.tsx.template')
    expect(packedFiles).toContain('cli/.generated-scaffold/app/[[...mdxPath]]/page.tsx')
    expect(packedFiles).toContain('cli/.generated-scaffold/content/index.tsx')
    expect(packedFiles).toContain('cli/.generated-scaffold/content/getting-started/introduction/index.mdx')
    expect(packedFiles).toContain('cli/.generated-scaffold/content/getting-started/introduction/create-next-app.mdx')
    expect(packedFiles).not.toContain('cli/.generated-scaffold/package.json.template')
    expect(packedFiles.some((file: string) => file.startsWith('cli/.generated-scaffold/public/'))).toBe(false)
    expect(
      packedFiles.some((file: string) =>
        /^cli\/\.generated-scaffold\/.*\.(?:ico|png|jpe?g|gif|webp|svg|mp4|webm|mov|vtt|woff2?|ttf|otf)$/i.test(file),
      ),
    ).toBe(false)
  })

  it('runs with npx from an empty directory', async () => {
    const emptyDirectory = resolve(temporaryDirectory, 'empty')
    await mkdir(emptyDirectory)
    const {stdout} = await execute(npxExecutable, ['--yes', `--package=${tarballPath}`, 'doctocat-nextjs', '--help'], {
      cwd: emptyDirectory,
    })

    expect(stdout).toContain('Usage: doctocat-nextjs')

    const version = await execute(
      npxExecutable,
      ['--yes', `--package=${tarballPath}`, 'doctocat-nextjs', '--version'],
      {cwd: emptyDirectory},
    )
    expect(version.stdout.trim()).toBe(JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8')).version)

    const noArguments = await execute(npxExecutable, ['--yes', `--package=${tarballPath}`, 'doctocat-nextjs'], {
      cwd: emptyDirectory,
    })
    expect(noArguments.stdout).toContain('Create and build Doctocat sites')

    const createHelp = await execute(
      npxExecutable,
      ['--yes', `--package=${tarballPath}`, 'doctocat-nextjs', 'create', '--help'],
      {cwd: emptyDirectory},
    )
    expect(createHelp.stdout).toContain('Usage: doctocat-nextjs create [options]')
    expect(createHelp.stdout).toContain('--repository-url <url>')
    expect(createHelp.stdout).toContain('choices: "npm"')
  }, 120_000)

  it('rejects unsupported options and symbolic-link writes', async () => {
    await expect(executePackedCli(['create'])).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining('Missing required options'),
    })

    const unsupportedTarget = resolve(temporaryDirectory, 'unsupported')
    await expect(
      executePackedCli([
        'create',
        '--target',
        unsupportedTarget,
        '--title',
        'Docs',
        '--base-path',
        '/docs',
        '--static-export',
        '--package-manager',
        'pnpm',
      ]),
    ).rejects.toMatchObject({code: 1})
    await expect(readdir(unsupportedTarget)).rejects.toThrow()

    const linkedTarget = resolve(temporaryDirectory, 'linked')
    const outsideDirectory = resolve(temporaryDirectory, 'outside')
    await mkdir(linkedTarget)
    await mkdir(outsideDirectory)
    await symlink(outsideDirectory, resolve(linkedTarget, 'content'), 'dir')
    await expect(
      executePackedCli([
        'create',
        '--target',
        linkedTarget,
        '--title',
        'Docs',
        '--base-path',
        '/docs',
        '--static-export',
        '--package-manager',
        'npm',
        '--force',
      ]),
    ).rejects.toMatchObject({code: 1})
    await expect(readdir(outsideDirectory)).resolves.toEqual([])

    const invalidRepositoryTarget = resolve(temporaryDirectory, 'invalid-repository')
    await expect(
      executePackedCli([
        'create',
        '--target',
        invalidRepositoryTarget,
        '--title',
        'Docs',
        '--base-path',
        '/docs',
        '--static-export',
        '--package-manager',
        'npm',
        '--repository-url',
        'not-a-url',
      ]),
    ).rejects.toMatchObject({code: 1})
    await expect(readdir(invalidRepositoryTarget)).rejects.toThrow()
  }, 120_000)

  it('defaults to root hosting when base path is omitted', async () => {
    const rootTarget = resolve(temporaryDirectory, 'root-project')
    await executePackedCli([
      'create',
      '--target',
      rootTarget,
      '--title',
      'Root Documentation',
      '--static-export',
      '--package-manager',
      'npm',
    ])

    const projectConfig = JSON.parse(await readFile(resolve(rootTarget, 'doctocat.project.json'), 'utf8'))
    expect(projectConfig.basePath).toBe('')
    expect(await readFile(resolve(rootTarget, 'next.config.ts'), 'utf8')).toContain('const basePath = ""')
  }, 120_000)

  it('uses the packed dependency to build the generated project', async () => {
    const siteTitle = 'Docs <API> & Guide'
    await executePackedCli([
      'create',
      '--target',
      projectDirectory,
      '--title',
      siteTitle,
      '--base-path',
      '/preview/docs',
      '--static-export',
      '--package-manager',
      'npm',
      '--repository-url',
      'https://code.example/organization/project/',
      '--repository-source-path',
      'packages/docs',
    ])

    const requiredFiles = [
      'package.json',
      'package-lock.json',
      'next.config.ts',
      'tsconfig.json',
      'app/layout.tsx',
      'app/[[...mdxPath]]/page.tsx',
      'mdx-components.js',
      'content/index.mdx',
      'content/index.tsx',
      'content/getting-started/index.mdx',
      'content/getting-started/introduction/index.mdx',
      'content/getting-started/introduction/create-next-app.mdx',
      'doctocat.project.json',
      '.gitignore',
      'AGENTS.md',
    ]
    for (const file of requiredFiles)
      await expect(readFile(resolve(projectDirectory, file), 'utf8')).resolves.toBeTruthy()
    await expect(readFile(resolve(projectDirectory, 'src/components/Pre/Pre.tsx'), 'utf8')).rejects.toThrow()
    await expect(readFile(resolve(projectDirectory, 'app/llms.txt/route.ts'), 'utf8')).rejects.toThrow()

    await expect(
      executePackedCli([
        'create',
        '--target',
        projectDirectory,
        '--title',
        siteTitle,
        '--base-path',
        '/preview/docs',
        '--static-export',
        '--package-manager',
        'npm',
      ]),
    ).rejects.toMatchObject({code: 1})
    await executePackedCli([
      'create',
      '--target',
      projectDirectory,
      '--title',
      siteTitle,
      '--base-path',
      '/preview/docs',
      '--static-export',
      '--package-manager',
      'npm',
      '--repository-url',
      'https://code.example/organization/project/',
      '--repository-source-path',
      'packages/docs',
      '--force',
    ])

    const packageJson = JSON.parse(await readFile(resolve(projectDirectory, 'package.json'), 'utf8'))
    const packageMetadata = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8'))
    expect(packageJson.engines).toEqual(packageMetadata.engines)
    expect(packageJson.scripts.dev).toBe('next dev')
    expect(packageJson.scripts.inspect).toBeUndefined()
    expect(packageJson.dependencies).toEqual({
      '@primer/doctocat-nextjs': packageMetadata.version,
      '@primer/react-brand': packageMetadata.devDependencies['@primer/react-brand'],
      next: packageMetadata.devDependencies.next,
      react: packageMetadata.devDependencies.react,
      'react-dom': packageMetadata.devDependencies['react-dom'],
    })
    const gitignoreEntries = (await readFile(resolve(projectDirectory, '.gitignore'), 'utf8')).split('\n')
    expect(gitignoreEntries).toEqual(['node_modules/', '.next/', 'out/', '.doctocat/', '*.tsbuildinfo'])

    const nextConfig = await readFile(resolve(projectDirectory, 'next.config.ts'), 'utf8')
    const homepage = await readFile(resolve(projectDirectory, 'content/index.mdx'), 'utf8')
    expect(nextConfig).toContain(`process.env.NEXT_PUBLIC_SITE_TITLE = ${JSON.stringify(siteTitle)}`)
    expect(nextConfig).toContain('const repositoryURL = "https://code.example/organization/project"')
    expect(nextConfig).toContain('const repositorySourcePath = "packages/docs"')
    expect(homepage).toContain(`title: ${JSON.stringify(siteTitle)}`)
    expect(homepage).toContain(`<HomepageComponent title={${JSON.stringify(siteTitle)}} />`)
    await expect(readFile(resolve(projectDirectory, 'AGENTS.md'), 'utf8')).resolves.toContain('npm run dev')
    await expect(
      readFile(resolve(packageRoot, '../site/content/getting-started/introduction/index.mdx'), 'utf8'),
    ).resolves.toContain('npm run dev')

    packageJson.dependencies['@primer/doctocat-nextjs'] = `file:${tarballPath}`
    await writeFile(resolve(projectDirectory, 'package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
    await rm(resolve(projectDirectory, 'package-lock.json'))
    await rm(resolve(projectDirectory, 'node_modules'), {recursive: true, force: true})
    await execute(npmExecutable, ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund'], {
      cwd: projectDirectory,
      maxBuffer: 20 * 1024 * 1024,
    })

    await writeFile(
      resolve(projectDirectory, 'public/example.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" /></svg>\n',
    )
    await writeFile(
      resolve(projectDirectory, 'content/index.mdx'),
      `${await readFile(resolve(projectDirectory, 'content/index.mdx'), 'utf8')}\n![Static asset](/example.svg)\n`,
    )
    await execute(npmExecutable, ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], {
      cwd: projectDirectory,
      maxBuffer: 20 * 1024 * 1024,
    })
    await execute(npmExecutable, ['run', 'check'], {cwd: projectDirectory, maxBuffer: 20 * 1024 * 1024})

    await execute(npmExecutable, ['run', 'build'], {
      cwd: projectDirectory,
      maxBuffer: 20 * 1024 * 1024,
    })
    const rootHtml = await readFile(resolve(projectDirectory, 'out/index.html'), 'utf8')
    const visibleRootText = rootHtml
      .replace(/<script[\s\S]*?<\/script>/g, '')
      .replace(/<style[\s\S]*?<\/style>/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
    await expect(readFile(resolve(projectDirectory, 'out/getting-started/index.html'), 'utf8')).resolves.toBeTruthy()
    const notFoundHtml = await readFile(resolve(projectDirectory, 'out/404.html'), 'utf8')
    expect(visibleRootText).toContain(siteTitle)
    expect(visibleRootText).not.toContain(JSON.stringify(siteTitle))
    expect(rootHtml).toContain('href="/preview/docs/getting-started/"')
    expect(rootHtml).toMatch(/src="\/preview\/docs\/_next\/static\/media\/example\.[^"]+\.svg"/)
    expect(notFoundHtml).toContain('href="/preview/docs/"')
    const gettingStartedHtml = await readFile(resolve(projectDirectory, 'out/getting-started/index.html'), 'utf8')
    expect(gettingStartedHtml).toContain(
      'href="https://code.example/organization/project/blob/main/packages/docs/content/getting-started/index.mdx"',
    )

    const manifest = JSON.parse(await readFile(resolve(projectDirectory, '.doctocat/build-manifest.json'), 'utf8'))
    const manifestPaths = manifest.routes.map((route: {path: string}) => route.path)
    expect(manifest).not.toHaveProperty('generatedAt')
    expect(manifestPaths).toEqual([
      '/preview/docs/',
      '/preview/docs/getting-started/',
      '/preview/docs/getting-started/introduction/',
      '/preview/docs/getting-started/introduction/create-next-app/',
    ])
    expect(manifestPaths).not.toContain('/preview/docs/404/')
    expect(manifestPaths).not.toContain('/preview/docs/_not-found/')
    expect(new Set(manifestPaths).size).toBe(manifestPaths.length)
    expect(manifestPaths).toEqual([...manifestPaths].sort())
    await expect(readFile(resolve(projectDirectory, 'out/.doctocat/build-manifest.json'), 'utf8')).rejects.toThrow()

    await rm(resolve(projectDirectory, 'content/getting-started/index.mdx'))
    await rm(resolve(projectDirectory, 'content/getting-started'), {recursive: true})
    await execute(npmExecutable, ['run', 'build'], {
      cwd: projectDirectory,
      maxBuffer: 20 * 1024 * 1024,
    })
    await expect(readFile(resolve(projectDirectory, 'out/getting-started/index.html'), 'utf8')).rejects.toThrow()
    const manifestAfterDeletion = JSON.parse(
      await readFile(resolve(projectDirectory, '.doctocat/build-manifest.json'), 'utf8'),
    )
    expect(manifestAfterDeletion.routes.map((route: {path: string}) => route.path)).toEqual(['/preview/docs/'])
  }, 300_000)

  it('rejects an invalid project before building', async () => {
    const invalidProject = resolve(temporaryDirectory, 'invalid')
    await mkdir(invalidProject)

    await expect(executePackedCli(['build', '--project', invalidProject])).rejects.toMatchObject({
      code: 1,
      stderr: expect.stringContaining('doctocat.project.json was not found'),
    })
  }, 120_000)

  it('keeps public CLI resources generic', async () => {
    const publicPaths = ['cli']
    const contents: string[] = []

    const collectFiles = async (directoryPath: string): Promise<void> => {
      const entries = await readdir(directoryPath, {withFileTypes: true})
      for (const entry of entries) {
        const entryPath = resolve(directoryPath, entry.name)
        if (entry.isDirectory()) await collectFiles(entryPath)
        else if (entry.isFile() && !entry.name.endsWith('.test.ts')) contents.push(await readFile(entryPath, 'utf8'))
      }
    }
    for (const publicPath of publicPaths) {
      const absolutePath = resolve(packageRoot, publicPath)
      if (publicPath.includes('.')) contents.push(await readFile(absolutePath, 'utf8'))
      else await collectFiles(absolutePath)
    }

    const publicText = contents.join('\n')
    expect(publicText).not.toMatch(/(?:\/Users\/|\/home\/|[A-Za-z]:\\Users\\)/)

    const stagedIntroduction = await readFile(
      resolve(packageRoot, 'cli/.generated-scaffold/content/getting-started/introduction/index.mdx'),
      'utf8',
    )
    expect(stagedIntroduction).toBe(
      await readFile(resolve(packageRoot, '../site/content/getting-started/introduction/index.mdx'), 'utf8'),
    )
    expect(await readFile(resolve(packageRoot, 'cli/.generated-scaffold/content/index.tsx'), 'utf8')).toBe(
      await readFile(resolve(packageRoot, '../site/content/index.tsx'), 'utf8'),
    )
    expect(
      await readFile(resolve(packageRoot, 'cli/.generated-scaffold/content/getting-started/index.mdx'), 'utf8'),
    ).toBe(await readFile(resolve(packageRoot, '../site/content/getting-started/index.mdx'), 'utf8'))
    expect(
      await readFile(
        resolve(packageRoot, 'cli/.generated-scaffold/content/getting-started/introduction/create-next-app.mdx'),
        'utf8',
      ),
    ).toBe(
      await readFile(resolve(packageRoot, '../site/content/getting-started/introduction/create-next-app.mdx'), 'utf8'),
    )
  })
})
