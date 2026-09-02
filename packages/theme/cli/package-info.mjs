import {readFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export async function getPackageInfo() {
  const packageJson = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8'))

  return {
    packageRoot,
    packageVersion: packageJson.version,
    engines: packageJson.engines,
    dependencies: {
      '@primer/doctocat-nextjs': packageJson.version,
      '@primer/react-brand': packageJson.devDependencies['@primer/react-brand'].replace(/^[~^]/, ''),
      next: packageJson.devDependencies.next,
      react: packageJson.devDependencies.react,
      'react-dom': packageJson.devDependencies['react-dom'],
    },
    devDependencies: {
      '@types/node': packageJson.devDependencies['@types/node'].replace(/^[~^]/, ''),
      '@types/react': packageJson.devDependencies['@types/react'].replace(/^[~^]/, ''),
      '@types/react-dom': packageJson.devDependencies['@types/react-dom'].replace(/^[~^]/, ''),
      typescript: packageJson.devDependencies.typescript,
    },
  }
}
