// eslint-disable-next-line node/no-missing-import
import { lstat, readFile, readdir, writeFile } from 'fs/promises'
import { join } from 'path'

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
  const esmDir = join(__dirname, '..', 'dist', 'esm')
  await processDirectory(esmDir)
}

async function processDirectory(directoryPath: string): Promise<void> {
  const fileNames = await readdir(directoryPath)

  for (const fileName of fileNames) {
    const filePath = join(directoryPath, fileName)
    const fileStats = await lstat(filePath)

    if (fileStats.isDirectory()) {
      await processDirectory(filePath)
    } else {
      await processFile(filePath)
    }
  }
}

async function processFile(filePath: string): Promise<void> {
  const thePattern = /^(\s*(import|export)\s+{.+}\s+from\s+'\.[A-Za-z0-9_./]+)';?\n?$/s
  const hasExtension = /\.(js|ts|d\.ts)$/s

  const ext = filePath.endsWith('.ts') ? 'd.ts' : 'js'

  const fileBytes = await readFile(filePath, { encoding: 'utf8' })
  const fileLines = fileBytes.split('\n')

  const transformedLines: string[] = []
  for (const line of fileLines) {
    const theMatch = thePattern.exec(line)
    if (theMatch && !hasExtension.exec(theMatch[1] as string)) {
      transformedLines.push(`${theMatch[1] as string}.${ext}';`)
    } else {
      transformedLines.push(line)
    }
  }

  await writeFile(filePath, transformedLines.join('\n'))
}
