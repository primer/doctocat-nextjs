import {mkdtemp, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {resolve} from 'node:path'
import {afterEach, describe, expect, it} from 'vitest'
import {readProject, validateBasePath} from './project-config.mjs'

describe('project configuration', () => {
  const temporaryDirectories = []

  afterEach(async () => {
    await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, {recursive: true, force: true})))
  })

  it.each(['/.', '/..', '/docs/./admin', '/docs/../admin'])('rejects dot-segment base path %s', basePath => {
    expect(validateBasePath(basePath)).toBe(
      'basePath must be empty or start with /, use URL-safe path segments other than . or .., and omit a trailing slash.',
    )
  })

  it.each(['', '/docs', '/.well-known', '/docs/~archive'])('accepts normalized base path %s', basePath => {
    expect(validateBasePath(basePath)).toBeNull()
  })

  it.each([null, [], 'config', 1])('returns a structured error for non-object JSON value %j', async config => {
    const projectDirectory = await mkdtemp(resolve(tmpdir(), 'doctocat-project-config-'))
    temporaryDirectories.push(projectDirectory)
    await writeFile(resolve(projectDirectory, 'doctocat.project.json'), JSON.stringify(config))

    await expect(readProject(projectDirectory)).resolves.toMatchObject({
      config: null,
      errors: [{code: 'INVALID_CONFIG', message: 'doctocat.project.json must contain a JSON object.'}],
    })
  })
})
