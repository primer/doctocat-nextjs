import {lstat, mkdir, readdir, readFile, writeFile} from 'node:fs/promises'
import {basename, dirname, isAbsolute, join, relative, resolve, sep} from 'node:path'
import {spawn} from 'node:child_process'
import console from 'node:console'
import process from 'node:process'
import {URL} from 'node:url'
import {getPackageInfo} from './package-info.mjs'
import {validateBasePath} from './project-config.mjs'

export async function createProject(options) {
  const normalizeRepositoryURL = value => {
    const suppliedRepositoryURL = value?.trim() ?? ''
    if (!suppliedRepositoryURL) return ''

    try {
      const parsedRepositoryURL = new URL(suppliedRepositoryURL)
      if (
        !['http:', 'https:'].includes(parsedRepositoryURL.protocol) ||
        parsedRepositoryURL.username ||
        parsedRepositoryURL.password ||
        parsedRepositoryURL.search ||
        parsedRepositoryURL.hash
      ) {
        throw new Error('Unsupported repository URL')
      }
      return suppliedRepositoryURL.replace(/\/+$/, '')
    } catch {
      throw new Error('--repository-url must be a valid HTTP or HTTPS URL without credentials, a query, or a hash.')
    }
  }

  const validateRepositorySourcePath = (value, repositoryURL) => {
    const repositorySourcePath = value?.trim() ?? ''
    if (repositorySourcePath && !repositoryURL) {
      return '--repository-source-path requires --repository-url.'
    }
    if (
      repositorySourcePath &&
      (!/^[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*$/.test(repositorySourcePath) ||
        repositorySourcePath.split('/').some(segment => segment === '.' || segment === '..'))
    ) {
      return '--repository-source-path must contain URL-safe relative path segments.'
    }
    return null
  }

  const missingRequiredOptions = [
    options.target === undefined ? '--target' : null,
    options.title === undefined ? '--title' : null,
    options.staticExport !== true ? '--static-export' : null,
    options.packageManager === undefined ? '--package-manager' : null,
  ].filter(Boolean)

  if (missingRequiredOptions.length > 0) {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      throw new Error(
        `Missing required options: ${missingRequiredOptions.join(', ')}. Run doctocat-nextjs create interactively or provide every required option.`,
      )
    }

    const {input} = await import('@inquirer/prompts')
    options.target ??= await input({
      message: 'Where do you want to output the site?',
      default: './docs-site',
      required: true,
    })
    options.title ??= await input({
      message: 'What is the site title?',
      default: 'Documentation',
      required: true,
      validate: value => (!/[\r\n\0]/.test(value) ? true : 'Enter a single-line title.'),
    })
    options.basePath ??= ''
    options.staticExport = true
    options.packageManager = 'npm'
  }

  if (!options.title.trim() || /[\r\n\0]/.test(options.title)) {
    throw new Error('--title must be a non-empty single-line value.')
  }
  options.basePath ??= ''
  const basePathError = validateBasePath(options.basePath)
  if (basePathError) throw new Error(basePathError)

  const repositoryURL = normalizeRepositoryURL(options.repositoryUrl)
  const repositorySourcePath = options.repositorySourcePath?.trim() ?? ''
  const repositorySourcePathError = validateRepositorySourcePath(repositorySourcePath, repositoryURL)
  if (repositorySourcePathError) throw new Error(repositorySourcePathError)

  const targetDirectory = resolve(options.target)
  const packageInfo = await getPackageInfo()
  const cliScaffoldDirectory = resolve(packageInfo.packageRoot, 'cli/.generated-scaffold')

  const assertNoSymlinks = async directory => {
    let entries
    try {
      entries = await readdir(directory, {withFileTypes: true})
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return
      throw error
    }

    for (const entry of entries) {
      const entryPath = resolve(directory, entry.name)
      const entryStats = await lstat(entryPath)
      if (entryStats.isSymbolicLink()) {
        throw new Error(`Refusing to write through symbolic link: ${relative(targetDirectory, entryPath)}`)
      }
      if (entryStats.isDirectory()) await assertNoSymlinks(entryPath)
    }
  }

  try {
    const targetStats = await lstat(targetDirectory)
    if (targetStats.isSymbolicLink() || !targetStats.isDirectory()) {
      throw new Error('The target must be a directory and cannot be a symbolic link.')
    }
    const entries = await readdir(targetDirectory)
    if (entries.length > 0 && !options.force) {
      throw new Error('The target directory is not empty. Re-run with --force to overwrite CLI scaffold files.')
    }
    if (options.force) await assertNoSymlinks(targetDirectory)
  } catch (error) {
    if (!(error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT')) throw error
  }

  await mkdir(targetDirectory, {recursive: true})

  const packageName =
    basename(targetDirectory)
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/^[._-]+|[._-]+$/g, '') || 'doctocat-site'
  const replacements = new Map([
    ['__DOCTOCAT_SITE_TITLE_JS__', JSON.stringify(options.title)],
    ['__DOCTOCAT_SITE_TITLE_YAML__', JSON.stringify(options.title)],
    ['__DOCTOCAT_BASE_PATH_JS__', JSON.stringify(options.basePath)],
    ['__DOCTOCAT_REPOSITORY_URL_JS__', JSON.stringify(repositoryURL)],
    ['__DOCTOCAT_REPOSITORY_SOURCE_PATH_JS__', JSON.stringify(repositorySourcePath)],
  ])

  const writeTargetFile = async (relativePath, contents) => {
    if (isAbsolute(relativePath)) throw new Error(`Refusing to write an absolute CLI scaffold path: ${relativePath}`)
    const destination = resolve(targetDirectory, relativePath)
    if (destination !== targetDirectory && !destination.startsWith(`${targetDirectory}${sep}`)) {
      throw new Error(`Refusing to write outside the target: ${relativePath}`)
    }
    await mkdir(dirname(destination), {recursive: true})
    await writeFile(destination, contents)
  }

  const copyCliScaffoldTemplates = async (sourceDirectory, relativeDirectory = '') => {
    const entries = await readdir(sourceDirectory, {withFileTypes: true})
    entries.sort((first, second) => (first.name < second.name ? -1 : first.name > second.name ? 1 : 0))

    for (const entry of entries) {
      const sourcePath = resolve(sourceDirectory, entry.name)
      const relativePath = join(relativeDirectory, entry.name)
      if (entry.isDirectory()) {
        await copyCliScaffoldTemplates(sourcePath, relativePath)
      } else if (entry.isFile()) {
        const outputPath = relativePath.endsWith('.template')
          ? relativePath.slice(0, -'.template'.length)
          : relativePath
        const targetPath = outputPath === 'gitignore' ? '.gitignore' : outputPath
        const template = await readFile(sourcePath, 'utf8')
        const contents = template.replace(/__DOCTOCAT_[A-Z_]+__/g, placeholder => {
          if (!replacements.has(placeholder)) throw new Error(`Unknown CLI scaffold placeholder: ${placeholder}`)
          return replacements.get(placeholder)
        })
        await writeTargetFile(targetPath, contents)
      }
    }
  }

  await copyCliScaffoldTemplates(cliScaffoldDirectory)
  await writeTargetFile(
    'package.json',
    `${JSON.stringify(
      {
        name: packageName,
        version: '0.0.0',
        private: true,
        type: 'module',
        engines: packageInfo.engines,
        scripts: {
          dev: 'next dev',
          build: 'doctocat-nextjs build --project .',
          check: 'tsc --noEmit',
        },
        dependencies: packageInfo.dependencies,
        devDependencies: packageInfo.devDependencies,
      },
      null,
      2,
    )}\n`,
  )
  await mkdir(resolve(targetDirectory, 'public'), {recursive: true})

  const npmExecutable = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const npmExitCode = await new Promise((resolveExitCode, reject) => {
    const child = spawn(
      npmExecutable,
      ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund'],
      {cwd: targetDirectory, stdio: 'inherit'},
    )
    child.on('error', reject)
    child.on('exit', exitCode => resolveExitCode(exitCode))
  })
  if (npmExitCode !== 0) throw new Error(`npm failed to generate package-lock.json (exit code ${npmExitCode}).`)

  console.log(`Created Doctocat project in ${targetDirectory}`)
  console.log(`Next: cd ${JSON.stringify(relative(process.cwd(), targetDirectory) || '.')} && npm ci`)
}
