// constants

const WORD_BANK = {
  object: [
    'assign',
    'create',
    'defineProperties',
    'defineProperty',
    'entries',
    'freeze',
    'fromEntries',
    'getOwnPropertyDescriptor',
    'getOwnPropertyDescriptors',
    'getOwnPropertyNames',
    'getOwnPropertySymbols',
    'getPrototypeOf',
    'groupBy',
    'hasOwn',
    'hasOwnProperty',
    'is',
    'isExtensible',
    'isFrozen',
    'isPrototypeOf',
    'isSealed',
    'keys',
    'preventExtensions',
    'propertyIsEnumerable',
    'seal',
    'setPrototypeOf',
    'toLocaleString',
    'toString',
    'valueOf',
    'values',
  ],
  array: [
    'at',
    'concat',
    'copyWithin',
    'entries',
    'every',
    'fill',
    'filter',
    'find',
    'findIndex',
    'findLast',
    'findLastIndex',
    'flat',
    'flatMap',
    'forEach',
    'from',
    'fromAsync',
    'includes',
    'indexOf',
    'isArray',
    'join',
    'keys',
    'lastIndexOf',
    'map',
    'of',
    'pop',
    'push',
    'reduce',
    'reduceRight',
    'reverse',
    'shift',
    'slice',
    'some',
    'sort',
    'splice',
    'toLocaleString',
    'toReversed',
    'toSorted',
    'toSpliced',
    'toString',
    'unshift',
    'values',
    'with',
  ],
}

const INIT_STATE = {
  timeouts: {},
  interval: 2000,
  gameId: 0,
  words: ['sadf','sdfsdf','sdfsfsfdsf','wqeryu'],
}
// variables

let state
let level

// elements

// const menuDialog = document.querySelector('#menu')
// const playButton = document.querySelector('#play')
const categoryOptions = document.querySelector('select')
const wordInput = document.querySelector('#typing')
const lanesSection = document.querySelectorAll('#lanes > div')

// listeners

wordInput.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    console.log(e.target.value)

    const wordEl = document.querySelectorAll('#lanes > div > div')
    console.log(wordEl)
    wordEl.forEach((word) => {
      if (word.innerText === e.target.value) {
        console.log('match')
        destroyWord(word)
      }
    })
    e.target.value = null
  }
})

// functions

const createCategories = () => {
  for (const key in WORD_BANK) {
    console.log(key)
    const newOptionEl = document.createElement('option')
    newOptionEl.innerText = key
    categoryOptions.appendChild(newOptionEl)
  }
}

const getRandomNumber = (num) => {
  return Math.floor(Math.random() * num)
}

const spawnWord = () => {

    const newWordDiv = document.createElement('div')
    newWordDiv.innerText = state.words.pop()
    console.log(newWordDiv)
    console.log(lanesSection[0])
    lanesSection[0].appendChild(newWordDiv)
}

const destroyWord = (el) => {
  el.remove()
}
const gameStart = () => {
  spawnWord()
}
const gameOver = () => {
  clearInterval(gameId)
  for (const key in state.timeouts) {
    clearTimeout(state.timeouts[key])
  }
}
const init = () => {
  state = { ...INIT_STATE }
  state.gameId = setInterval(gameStart, state.interval)
}

// game

// createCategories()
// menuDialog.showModal()
// playButton.addEventListener('click', () => {
//   menuDialog.close()
// })
init()
