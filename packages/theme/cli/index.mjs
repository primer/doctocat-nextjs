#!/usr/bin/env node

import console from 'node:console'
import process from 'node:process'
import {Command, Option} from 'commander'
import {getPackageInfo} from './package-info.mjs'

const {packageVersion} = await getPackageInfo()

const program = new Command()
  .name('doctocat-nextjs')
  .description('Create and build Doctocat sites')
  .version(packageVersion)
  .allowExcessArguments(false)
  .showHelpAfterError()
  .showSuggestionAfterError()
  .action(() => program.help())

program
  .command('create')
  .description('Create a static-export Doctocat project')
  .allowExcessArguments(false)
  .option('--target <directory>', 'directory to create')
  .option('--title <title>', 'site title')
  .option('--base-path <path>', 'optional URL base path without a trailing slash')
  .option('--static-export', 'configure a deterministic static export')
  .addOption(new Option('--package-manager <manager>', 'package manager').choices(['npm']))
  .option('--repository-url <url>', 'repository URL for source edit links')
  .option('--repository-source-path <path>', 'content path within the repository')
  .option('--force', 'overwrite CLI scaffold files in a non-empty target')
  .action(async options => {
    const {createProject} = await import('./create.mjs')
    await createProject(options)
  })

program
  .command('build')
  .description('Build a project and write its route manifest')
  .allowExcessArguments(false)
  .requiredOption('--project <directory>', 'Doctocat project directory')
  .action(async options => {
    const {buildProject} = await import('./build.mjs')
    await buildProject(options)
  })

program.parseAsync().catch(error => {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
})
