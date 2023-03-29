const { writeOutputJSON, writeMultipleOutputs } = require('./output')
const { readFile } = require("node:fs/promises")


const data = {
  itemCounts: {
    cdRPG: 1,
    teeBlack: 2,
    posters: 3,
    sweats: 3,
    vinyls: 4,
    teeWhite: 5,
    blisterStickers: 5,
    cdSpectre: 7
  },
  posterNumbers: [434, 435, 437],
  tshirtNumbers: [2, 6, 7, 7, 7]
}

const alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const dictPath = "./data/frenchWords.json";

const loadDictionary = async () => {
  const dictFileContents = await readFile(dictPath, { encoding: 'utf8' })
  const dict = JSON.parse(dictFileContents);
  // remove accents and special chars
  const normalized = dict.map(word =>
    word
      .replaceAll("é", "e")
      .replaceAll("è", "e")
      .replaceAll("ê", "e")
      .replaceAll("à", "a")
      .replaceAll("ç", "c")
  )
  return dict;
}

const convertToLetter = (n) => alphabet[n - 1];

const convertItemCountsToLetters = () => {
  const itemCounts = Object.values(data.itemCounts);
  return itemCounts.map(n => convertToLetter(n));
}

const getRandomLetterIndex = (letters) => Math.min(Math.floor(Math.random() * letters.length), letters.length - 1);

const generateRandomWord = (letters = [""], uniqueLetters = false) => {
  let word = ""
  const usedLetterIndices = []
  for(let i = 0; i < letters.length; i++) {
    let index = getRandomLetterIndex(letters)
    if(uniqueLetters) {
      while(usedLetterIndices.includes(index)) {
        index = getRandomLetterIndex(letters)
      }
    }
    word += letters[index]
  }
  return word
}


const generateUniqueWords = (letters, limit = 100, uniqueLetters = false) => {
  console.log('generating ', limit, ' unique words with given letters: ', letters.join(', '))
  const words = [];
  let i = 0;
  while(i < limit) {
    const word = generateRandomWord(letters, uniqueLetters);
    if(!words.includes(word)) {
      words.push(word);
      i++
    }
  }
  console.log(words)
  return words;
}

const getExistingWords = (dictionary, words) => {
  console.log('searching for existing french words...')
  const existing =  words.filter(word => dictionary.includes(word.toLowerCase()))
  console.log('found ', existing.length, ' existing words:\n', existing)
  return existing;
}


const main = async () => {
  const dictionary = await loadDictionary()
  const itemLetters = convertItemCountsToLetters()
  const words = generateUniqueWords(itemLetters, 10000, true);
  const existingWords = getExistingWords(dictionary, words)
  writeMultipleOutputs({
    words, itemLetters, existingWords
  })
}

main()