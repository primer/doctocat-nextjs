import {readFile, stat} from 'node:fs/promises'
import {isAbsolute, relative, resolve} from 'node:path'

const requiredProjectFiles = [
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'app/layout.tsx',
  'app/[[...mdxPath]]/page.tsx',
  'mdx-components.js',
  'content/index.mdx',
]

export function validateBasePath(basePath) {
  if (typeof basePath !== 'string') return 'basePath must be a string.'
  if (basePath === '') return null
  if (!/^\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*$/.test(basePath)) {
    return 'basePath must be empty or start with / and contain URL-safe path segments without a trailing slash.'
  }
  return null
}

export async function readProject(projectDirectory) {
  const errors = []
  const configPath = resolve(projectDirectory, 'doctocat.project.json')
  let config

  try {
    config = JSON.parse(await readFile(configPath, 'utf8'))
  } catch (error) {
    errors.push({
      code: 'CONFIG_UNREADABLE',
      message:
        error instanceof SyntaxError
          ? 'doctocat.project.json contains invalid JSON.'
          : 'doctocat.project.json was not found. Run create or add a valid project configuration.',
    })
    return {config: null, projectRoot: projectDirectory, outputDirectory: null, errors}
  }

  if (config.schemaVersion !== 1) {
    errors.push({code: 'UNSUPPORTED_SCHEMA', message: 'schemaVersion must be 1.'})
  }
  if (config.framework !== 'doctocat-nextjs') {
    errors.push({code: 'INVALID_FRAMEWORK', message: 'framework must be "doctocat-nextjs".'})
  }
  if (config.staticExport !== true) {
    errors.push({code: 'STATIC_EXPORT_REQUIRED', message: 'staticExport must be true for CLI build support.'})
  }

  const basePathError = validateBasePath(config.basePath)
  if (basePathError) errors.push({code: 'INVALID_BASE_PATH', message: basePathError})

  const resolveRelativePath = (value, field, allowCurrentDirectory) => {
    if (typeof value !== 'string' || value.length === 0 || isAbsolute(value)) {
      errors.push({code: 'INVALID_PATH', message: `${field} must be a non-empty relative path.`})
      return null
    }

    const resolvedPath = resolve(projectDirectory, value)
    const relativePath = relative(projectDirectory, resolvedPath)
    if (relativePath.startsWith('..') || isAbsolute(relativePath) || (!allowCurrentDirectory && relativePath === '')) {
      errors.push({code: 'PATH_OUTSIDE_PROJECT', message: `${field} must stay inside the project directory.`})
      return null
    }
    return resolvedPath
  }

  const projectRoot = resolveRelativePath(config.projectRoot, 'projectRoot', true) ?? projectDirectory
  const outputDirectory =
    typeof config.outputDirectory === 'string' && projectRoot ? resolve(projectRoot, config.outputDirectory) : null

  if (
    !outputDirectory ||
    isAbsolute(config.outputDirectory ?? '') ||
    relative(projectRoot, outputDirectory).startsWith('..') ||
    relative(projectRoot, outputDirectory) === ''
  ) {
    errors.push({code: 'INVALID_OUTPUT_DIRECTORY', message: 'outputDirectory must stay inside the project root.'})
  }

  if (outputDirectory) {
    const manifestDirectory = resolve(projectRoot, '.doctocat')
    const manifestRelativeToOutput = relative(outputDirectory, manifestDirectory)
    if (!manifestRelativeToOutput.startsWith('..') && !isAbsolute(manifestRelativeToOutput)) {
      errors.push({
        code: 'MANIFEST_IN_OUTPUT',
        message: 'outputDirectory cannot contain the .doctocat manifest directory.',
      })
    }
  }

  for (const file of requiredProjectFiles) {
    try {
      const fileStats = await stat(resolve(projectRoot, file))
      if (!fileStats.isFile()) throw new Error('Not a file')
    } catch {
      errors.push({code: 'MISSING_PROJECT_FILE', message: `Required project file is missing: ${file}`})
    }
  }

  try {
    const contentStats = await stat(resolve(projectRoot, 'content'))
    if (!contentStats.isDirectory()) throw new Error('Not a directory')
  } catch {
    errors.push({code: 'MISSING_CONTENT_DIRECTORY', message: 'Required content directory is missing: content'})
  }

  return {config, projectRoot, outputDirectory, errors}
}
