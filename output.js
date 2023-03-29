const { writeFile } = require('node:fs/promises');

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

const outputDir = './'
const outputPath = "./output.json"

module.exports = {
  writeOutputJSON,
  writeMultipleOutputs,
  outputDir,
  outputPath
}