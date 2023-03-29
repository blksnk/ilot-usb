const { readdir, writeFile } = require('node:fs/promises');

const rootDir = "./data/archipel-1/Îlot"

const outputDir = './'
const outputPath = "./output.json"

const alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ]


const traverseDir = async (dir) => {
  console.log("reading dir: ", dir)
  const contents = await readdir(dir)
  // only traverse sub directories, ignore files
  const subContents = await Promise.all(
    contents
    .filter(subPath => !subPath.includes("."))
    .map(subPath => traverseDir(dir + '/' + subPath))
  )
  const dirData = {
    path: dir,
    subDirCount: subContents.length ?? 0,
    subDirs: subContents ?? []
  }
  return dirData;
}

// get number of sub directories per directory
const aggregateDirCounts = (dirData) => {
  console.log("aggregating dir ", dirData.path, ' containing ', dirData.subDirCount, ' sub dirs')
  // exit early if no more subdirs
  if(!dirData.subDirs[0]) return [dirData.subDirCount]
  const subDirDirCounts = aggregateDirCounts(dirData.subDirs[0])
  const counts = [ dirData.subDirCount, ...subDirDirCounts ]
  return counts
}

const aggregateRootDir = (rootDirData) => {
  console.log("aggregating root dir data")

  const rootCounts = rootDirData.subDirs.map(subDir => aggregateDirCounts(subDir))
  return rootCounts;
}

const addCounts = (rootCounts) => {
  const sums = rootCounts.map(count => count.reduce((acc, n) => acc + n, 0))
  return sums
}

const multiplyCounts = (rootCounts) => rootCounts.map(counts => removeTrailingZero(counts).reduce((acc, n) => acc * n, 1))

const divideCounts = (rootCounts) => rootCounts.map(counts => removeTrailingZero(counts).reduce((acc, n) => acc / n,  counts[0] ?? 1))

const assignLetters = (rootCounts) => rootCounts.map(count => count.map(n => alphabet[n] ?? '?'))

const removeTrailingZero = (counts) => counts.filter(n => n !== 0);

const tryForCoordinates = (rootCounts) => {
  const separatorIndex = rootCounts.findIndex(counts => counts.length === 0);

  const firstHalf = rootCounts.slice(0, separatorIndex - 1)
  const secondHalf = rootCounts.slice(separatorIndex + 1)

  console.log(firstHalf, secondHalf)

  const firstN = multiplyCounts(firstHalf).reduce((acc, n) => acc * n, 1)
  const secondN = multiplyCounts(secondHalf).reduce((acc, n) => acc * n, 1)

  return {
    firstHalf,
    secondHalf,
    firstN,
    secondN
  }
}

const main = async () => {
  const rootDirData = await traverseDir(rootDir)
  const rootCounts = aggregateRootDir(rootDirData)


  const sums = addCounts(rootCounts)
  const multiplications = multiplyCounts(rootCounts)
  const divisions = divideCounts(rootCounts)
  const letters = assignLetters(rootCounts)

  const maybeCoords = tryForCoordinates(rootCounts)


  const outputs = {
    counts: rootCounts,
    sums,
    multiplications,
    divisions,
    letters,
    maybeCoords,
    dirData: rootDirData,
  }

  await writeMultipleOutputs(outputs)
}


const writeOutputJSON = async (data, path = outputPath) => {
  const filePath = outputDir + path + '.json'
  console.log('writing file: ', filePath)
  const stringData = JSON.stringify(data);
  const fileData = new Uint8Array(Buffer.from(stringData))
  await writeFile(outputDir + path + '.json', fileData)
}

const writeMultipleOutputs = async (outputs) => {
  console.log('writing multiple JSON output files...')
  await Promise.all(Object.entries(outputs).map(([name, data]) => writeOutputJSON(data, name)))
  console.log('files written')
}


main()
