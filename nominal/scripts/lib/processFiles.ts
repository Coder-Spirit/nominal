// eslint-disable-next-line node/no-missing-import
import { lstat, readFile, readdir, writeFile } from 'fs/promises'
import { join } from 'path'

export async function processDirectory(
  directoryPath: string,
  ext: string,
): Promise<void> {
  const fileNames = await readdir(directoryPath)

  for (const fileName of fileNames) {
    const filePath = join(directoryPath, fileName)
    const fileStats = await lstat(filePath)

    if (fileStats.isDirectory()) {
      await processDirectory(filePath, ext)
    } else {
      await processFile(filePath, ext)
    }
  }
}

export async function processFile(
  filePath: string,
  ext: string,
): Promise<void> {
  const thePattern = /^(.*}\s+from\s+'\.[A-Za-z0-9_./]+)';?\n?$/s
  const hasExtension = /\.(js|ts|d\.ts)$/s

  if (!filePath.endsWith(ext)) {
    return
  }

  const fileBytes = await readFile(filePath, { encoding: 'utf8' })
  const fileLines = fileBytes.split('\n')

  const transformedLines: string[] = []
  let transformed = false
  for (const line of fileLines) {
    const theMatch = thePattern.exec(line)
    if (theMatch && !hasExtension.exec(theMatch[1] as string)) {
      transformedLines.push(`${theMatch[1] as string}${ext}';`)
      transformed = true
    } else {
      transformedLines.push(line)
    }
  }

  if (transformed) {
    await writeFile(filePath, transformedLines.join('\n'))
  }
}
