import {spawn} from 'node:child_process'
import console from 'node:console'
import {access, mkdir, readFile, rm, stat, writeFile} from 'node:fs/promises'
import {dirname, relative, resolve} from 'node:path'
import process from 'node:process'
import {getPackageInfo} from './package-info.mjs'
import {readProject} from './project-config.mjs'
import {discoverSourceRoutes} from './source-routes.mjs'

export async function buildProject(options) {
  const projectDirectory = resolve(options.project)
  const project = await readProject(projectDirectory)
  if (project.errors.length > 0) {
    throw new Error(`Project validation failed:\n${project.errors.map(error => `- ${error.message}`).join('\n')}`)
  }

  const sourceRoutes = await discoverSourceRoutes(
    resolve(project.projectRoot, 'content'),
    project.config.basePath ?? '',
  )
  const nextExecutable = resolve(project.projectRoot, 'node_modules/next/dist/bin/next')
  try {
    await access(nextExecutable)
  } catch {
    throw new Error('Next.js is not installed. Run npm ci in the project before building.')
  }

  await rm(project.outputDirectory, {recursive: true, force: true})

  const buildExitCode = await new Promise((resolveExitCode, reject) => {
    const child = spawn(process.execPath, [nextExecutable, 'build', '--webpack'], {
      cwd: project.projectRoot,
      env: {
        ...process.env,
        NEXT_PUBLIC_DOCTOCAT_BASE_PATH: project.config.basePath,
      },
      stdio: 'inherit',
    })
    child.on('error', reject)
    child.on('exit', exitCode => resolveExitCode(exitCode))
  })
  if (buildExitCode !== 0) throw new Error(`Next.js build failed (exit code ${buildExitCode}).`)

  try {
    const outputStats = await stat(project.outputDirectory)
    if (!outputStats.isDirectory()) throw new Error('Not a directory')
  } catch {
    throw new Error(`Configured output directory was not created: ${project.config.outputDirectory}`)
  }

  const decodeHtml = value =>
    value
      .replace(/&#(\d+);/g, (_match, codePoint) => String.fromCodePoint(Number(codePoint)))
      .replace(/&#x([\da-f]+);/gi, (_match, codePoint) => String.fromCodePoint(Number.parseInt(codePoint, 16)))
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')

  const routePaths = new Set()
  const routes = await Promise.all(
    sourceRoutes.map(async sourceRoute => {
      if (routePaths.has(sourceRoute.path)) {
        throw new Error(`Multiple content files resolve to the public route ${sourceRoute.path}`)
      }
      routePaths.add(sourceRoute.path)

      const sourcePath = sourceRoute.source.replace(/^content\//, '').replace(/\.(?:md|mdx)$/, '')
      const sourceSegments = sourcePath.split('/')
      if (sourceSegments.at(-1) === 'index') sourceSegments.pop()
      const htmlFile = resolve(project.outputDirectory, ...sourceSegments, 'index.html')

      try {
        const htmlStats = await stat(htmlFile)
        if (!htmlStats.isFile()) throw new Error('Not a file')
      } catch {
        throw new Error(
          `Expected exported HTML was not found for ${sourceRoute.path}: ${relative(project.projectRoot, htmlFile)}`,
        )
      }

      const html = await readFile(htmlFile, 'utf8')
      const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
      const descriptionTag = html.match(/<meta\s+[^>]*name=["']description["'][^>]*>/i)?.[0]
      const description = descriptionTag?.match(/content=["']([^"']*)["']/i)?.[1]

      return {
        path: sourceRoute.path,
        ...(title ? {title: decodeHtml(title)} : sourceRoute.title ? {title: sourceRoute.title} : {}),
        ...(description
          ? {description: decodeHtml(description)}
          : sourceRoute.description
            ? {description: sourceRoute.description}
            : {}),
      }
    }),
  )
  routes.sort((first, second) => (first.path < second.path ? -1 : first.path > second.path ? 1 : 0))

  const packageInfo = await getPackageInfo()
  const manifest = {
    schemaVersion: 1,
    framework: 'doctocat-nextjs',
    packageVersion: packageInfo.packageVersion,
    basePath: project.config.basePath,
    outputDirectory: project.config.outputDirectory,
    routes,
  }
  const manifestPath = resolve(project.projectRoot, '.doctocat/build-manifest.json')
  await mkdir(dirname(manifestPath), {recursive: true})
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Wrote ${relative(project.projectRoot, manifestPath)} with ${routes.length} routes.`)
}
