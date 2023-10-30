// constants

const WORD_BANK = {
  'object methods': [
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
  'array methods': [
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
  timeouts: [], // stashing timeoutIDs
  delay: 2000,
  weight: 10,
  gameId: 0, //intervalId
  words: [],
  score: 0,
  count: 1,
}
// variables

let state
let difficulty

// elements

const bodyEl = document.querySelector('body')

const menuDialog = document.querySelector('#main-menu')
const categorySelect = document.querySelector('#category')
const rulesDialog = document.querySelector('#rules-menu')
const playButton = document.querySelector('#play')
const rulesButton = document.querySelector('#rules')
const menuButton = document.querySelector('#menu')

const lanesSection = document.querySelectorAll('#lanes > div')
const typingInput = document.querySelector('#typing')

// listeners

rulesButton.addEventListener('click', () => {
  menuDialog.close()
  rulesDialog.showModal()
})
menuButton.addEventListener('click', (e) => {
  rulesDialog.close()
  menuDialog.showModal()
})
playButton.addEventListener('click', () => {
  menuDialog.close()
  console.dir(menuDialog)
  typingInput.removeAttribute('disabled')
  loadGame()
})

typingInput.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    typingInput.removeAttribute('placeholder')

    const wordEl = document.querySelectorAll('#lanes > div > div')
    wordEl.forEach((word) => {
      if (word.innerText === e.target.value) {
        console.log(`yeet`)
        destroyWord(word)
      }
    })
    console.log(`bruh`)
    e.target.value = null
  }
})

// FUNCTIONS

// helpers
/**
 *
 * @param {HTMLElementTagNameMap} element
 * @param {Document} parentElement
 * @param {string} html
 */
const appendNewElement = (element, parentElement, html) => {
  const newEl = document.createElement(element)
  newEl.innerHTML = html
  parentElement.appendChild(newEl)
}

const getRandomNumber = (num) => {
  return Math.floor(Math.random() * num)
}

// in game stuff

const gameOver = () => {
  clearInterval(gameId)
  for (const key in state.timeouts) {
    clearTimeout(state.timeouts[key])
  }
}

const spawnWord = () => {
  const newWordDiv = document.createElement('div')
  newWordDiv.innerText = state.words.pop()
  newWordDiv.classList.add('word')
  console.log(state.weight)
  newWordDiv.style.animationDuration = `${state.weight}s`
  lanesSection[0].appendChild(newWordDiv)
}

const destroyWord = (el) => {
  clearTimeout(el.target)
  el.remove()
}

// game loop stuff
const createCategories = () => {
  for (const key in WORD_BANK) {
    appendNewElement('option', categorySelect, key)
  }
}

const buildMenu = () => {
  menuDialog.showModal()
}

const startGame = () => {
  if (state.words.length > 0) {
    spawnWord()
  }
}
const loadGame = () => {
  //getDifficulty
  //getSelectedCategory
  // state.words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet']
  state.words = WORD_BANK[categorySelect.selectedOptions[0].innerText]

  state.weight
  // build randomized word array
  typingInput.setAttribute('autofocus', '')

  state.gameId = setInterval(startGame, state.delay)
}

const init = () => {
  createCategories()
  // load assets
  difficulty = 1
  state = { ...INIT_STATE }
  // load menu
  buildMenu()
}
// game loop

// init
// - menu
// - get difficulty
// - set state.interval ()
// - set words[]
// - start game (spawn words based on interval)
//   - if words[].length === 0
//     - init
//   - setTimeOuts that execute after set delay should trigger game over
//   - if words
init()
