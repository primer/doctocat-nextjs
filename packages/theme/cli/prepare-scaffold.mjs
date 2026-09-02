import {access, cp, mkdir, readFile, rm} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

async function prepareCliScaffold() {
  const cliRoot = dirname(fileURLToPath(import.meta.url))
  const packageRoot = resolve(cliRoot, '..')
  const siteRoot = resolve(packageRoot, '../site')
  const cliScaffoldSource = resolve(cliRoot, 'scaffold')
  const packagedCliScaffold = resolve(cliRoot, '.generated-scaffold')

  let hasRepositorySource = false
  try {
    const sitePackage = JSON.parse(await readFile(resolve(siteRoot, 'package.json'), 'utf8'))
    hasRepositorySource = sitePackage.name === 'doctocat-nextjs-site' && sitePackage.private === true
  } catch {
    hasRepositorySource = false
  }

  if (!hasRepositorySource) {
    try {
      await access(packagedCliScaffold)
      return
    } catch {
      throw new Error('The CLI scaffold source and packaged template are unavailable.')
    }
  }

  await rm(packagedCliScaffold, {recursive: true, force: true})
  await cp(cliScaffoldSource, packagedCliScaffold, {recursive: true})

  await mkdir(resolve(packagedCliScaffold, 'app/[[...mdxPath]]'), {recursive: true})
  await cp(
    resolve(siteRoot, 'app/[[...mdxPath]]/page.tsx'),
    resolve(packagedCliScaffold, 'app/[[...mdxPath]]/page.tsx'),
  )
  await mkdir(resolve(packagedCliScaffold, 'content/getting-started'), {recursive: true})
  await cp(resolve(siteRoot, 'content/index.tsx'), resolve(packagedCliScaffold, 'content/index.tsx'))
  await cp(
    resolve(siteRoot, 'content/getting-started/index.mdx'),
    resolve(packagedCliScaffold, 'content/getting-started/index.mdx'),
  )
  await cp(
    resolve(siteRoot, 'content/getting-started/introduction'),
    resolve(packagedCliScaffold, 'content/getting-started/introduction'),
    {
      recursive: true,
    },
  )
}

await prepareCliScaffold()
