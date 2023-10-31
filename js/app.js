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
  delay: 3000,
  weight: 15,
  gameId: 0, //intervalId
  words: [],
  score: 0,
  count: 1,
  difficulty: 1,
}

const DIFFICULTY = {
  'new game': 1,
  'new game+': 2,
  'new game++': 3,
}
// variables

let state
let isGameOver

// elements

const bodyEl = document.querySelector('body')

const menuDialog = document.querySelector('#main-menu')
const rulesDialog = document.querySelector('#rules-menu')
const ripDialog = document.querySelector('#rip')

const categorySelect = document.querySelector('#category')
const difficultySelect = document.querySelector('#difficulty')
const playButton = document.querySelector('#play')
const rulesButton = document.querySelector('#rules')
const rulesMenuButton = document.querySelector('#menu1')
const ripMenuButton = document.querySelector('#menu2')

const lanesSection = document.querySelectorAll('#lanes > div')
const typingInput = document.querySelector('#typing')

// UTILITY FUNCTIONS

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

// listeners

// needed a way to remove using the escape key to close a <dialog>
bodyEl.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault()
  } 
})

playButton.addEventListener('click', () => {
  menuDialog.close()
  typingInput.removeAttribute('disabled')
  loadGame()
})
rulesButton.addEventListener('click', () => {
  menuDialog.close()
  rulesDialog.showModal()
})
rulesMenuButton.addEventListener('click', () => {
  rulesDialog.close()
  menuDialog.showModal()
})
ripMenuButton.addEventListener('click', () => {
  ripDialog.close()
  menuDialog.showModal()
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
        return
      }
    })
    e.target.value = null
  }
})

// OTHER FUNCTIONS

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
  console.dir(el)
  clearTimeout(el.target)
  el.remove()
}

// overarching game thangs (need to label this properly)
const buildCategories = () => {
  for (const key in WORD_BANK) {
    appendNewElement('option', categorySelect, key)
  }
}
const buildDifficulties = () => {
  for (const key in DIFFICULTY) {
    appendNewElement('option', difficultySelect, key)
    console.log(key)
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

const endGame = () => {
  ripDialog.showModal()
}

const loadGame = () => {
  //getDifficulty
  //getSelectedCategory
  state.words = WORD_BANK[categorySelect.selectedOptions[0].innerText]
  state.difficulty = DIFFICULTY[difficultySelect.selectedOptions[0].innerText]
  state.weight /= state.difficulty
  state.delay /= state.difficulty
  // build randomized word array

  state.gameId = setInterval(startGame, state.delay)
  isGameOver = setTimeout(endGame, 2000)
}

const init = () => {
  buildMenu()
  buildCategories()
  buildDifficulties()

  // load assets
  isGameOver = false
  state = { ...INIT_STATE }
  // load menu
}

init()
