const { writeOutputJSON, writeMultipleOutputs } = require('./output')

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

const alphabet = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ]


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

  return words;
}


const main = () => {
  const itemLetters = convertItemCountsToLetters()
  const words = generateUniqueWords(itemLetters, 200, true);

  console.log(words)
  writeMultipleOutputs({
    words, itemLetters
  })
}

main()