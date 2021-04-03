import { join } from 'path'
import { processDirectory } from './lib/processFiles'

run()
  .then(() => {
    // Do nothing
  })
  .catch((e) => {
    console.log('Unknown Error', e)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  })

async function run(): Promise<void> {
  const esmDir = join(__dirname, '..', 'deno')
  await processDirectory(esmDir, '.ts')
}
