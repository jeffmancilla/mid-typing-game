// /@ts-check
// constants

const WORD_BANK = {
  tutorial: ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog'],
  'common words': [
    'the',
    'be',
    'to',
    'of',
    'and',
    'a',
    'in',
    'that',
    'have',
    'it',
    'for',
    'not',
    'on',
    'with',
    'he',
    'as',
    'you',
    'do',
    'at',
    'this',
    'but',
    'his',
    'by',
    'from',
    'they',
    'we',
    'say',
    'she',
    'or',
    'an',
    'will',
    'my',
    'one',
    'all',
    'would',
    'there',
    'their',
    'what',
    'so',
    'up',
    'out',
    'if',
    'about',
    'who',
    'get',
    'which',
    'go',
    'me',
    'when',
    'make',
    'can',
    'like',
    'time',
    'no',
    'just',
    'him',
    'know',
    'take',
    'people',
    'into',
    'year',
    'your',
    'good',
    'some',
    'could',
    'them',
    'see',
    'other',
    'than',
    'then',
    'now',
    'look',
    'only',
    'come',
    'its',
    'over',
    'think',
    'also',
    'back',
    'after',
    'use',
    'two',
    'how',
    'our',
    'work',
    'first',
    'well',
    'way',
    'even',
    'new',
    'want',
    'because',
    'any',
    'these',
    'give',
    'day',
    'most',
    'us',
    'her',
  ],
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

const DIFFICULTY = {
  'new game': 1,
  'new game+': 2,
  'new game++': 3,
  'new game+7': 7,
}

const INIT_STATE = {
  words: [],
  timeouts: [], // for stashing timeoutIds
  delay: 3000, // milliseconds
  weight: 15, // seconds
  difficulty: 1, //difficulty multiplier
  score: 0,
}

// variables

let state
let levelComplete
let gameId

// elements

const bodyEl = document.querySelector('body')

const menuDialog = document.querySelector('#main-menu')
const rulesDialog = document.querySelector('#rules-menu')
const loseDialog = document.querySelector('#rip')
const winDialog = document.querySelector('#win')

const categorySelect = document.querySelector('#category')
const difficultySelect = document.querySelector('#difficulty')
const playButton = document.querySelector('#play')
const rulesButton = document.querySelector('#rules')
const rulesMenuButton = document.querySelector('#menu1')
const ripMenuButton = document.querySelector('#menu2')
const winMenuButton = document.querySelector('#menu3')

const lanesSection = document.querySelectorAll('#lanes > div')
const typingInput = document.querySelector('#typing')

const ripAudio = document.querySelector('#rip-audio')
console.dir(ripAudio)

// UTILITY FUNCTIONS

/**
 *
 * @param {keyof HTMLElementTagNameMap} element
 * @param {Document} parentElement
 * @param {string} html
 */
const appendNewElement = (element, parentElement, html) => {
  const newEl = document.createElement(element)
  newEl.innerHTML = html
  parentElement.appendChild(newEl)
}

/**
 *
 * @param {number} n
 * @returns {number} integer max n
 */
const getRandomNumber = (n) => {
  return Math.floor(Math.random() * n)
}

const clearTimers = () => {
  console.log(`clearing interval ${gameId}`)
  clearInterval(gameId)
  console.log(`clearing timeout ${levelComplete}`)
  clearTimeout(levelComplete)
  console.dir(state.timeouts)
  state.timeouts.forEach((timeout) => clearTimeout(timeout))
}

// LISTENERS

// buttons
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
  loseDialog.close()
  init()
})
winMenuButton.addEventListener('click', () => {
  winDialog.close()
  init()
})

// needed a way to remove using the escape key to close a <dialog>
bodyEl.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault()
  }
})

// capture keydown events
bodyEl.addEventListener('keydown', (e) => {
  // still want my browser refresh and dev tools!
  if (e.key === 'F5' || e.key === 'F12') {
    return
  }
  e.preventDefault()
  // ignore these keys
  if (
    e.key === 'CapsLock' ||
    e.key === 'Control' ||
    e.key === 'Alt' ||
    e.key === 'Shift' ||
    e.key === 'Escape' ||
    e.key === 'Delete'
  ) {
    return
  }
  // reallow user to backspace out of typed keys
  else if (e.key === 'Backspace') {
    const valueString = `${typingInput.value}`
    typingInput.value = valueString.slice(0, valueString.length - 1)
  }
  // typed word match condition
  else if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
    const wordEl = document.querySelectorAll('#lanes > div > div')
    wordEl.forEach((word) => {
      if (word.innerText === typingInput.value) {
        destroyWord(word)
      }
    })
    typingInput.value = null
  }
  // add key to text input element
  else {
    typingInput.value += e.key
  }
})

// old way to track player inputs
// typingInput.addEventListener('keydown', (e) => {
//   if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
//     e.preventDefault()

//     const wordEl = document.querySelectorAll('#lanes > div > div')
//     wordEl.forEach((word) => {
//       if (word.innerText === e.target.value) {
//         destroyWord(word)
//         return
//       }
//     })
//     e.target.value = null
//   }
// })

// OTHER FUNCTIONS

// in game stuff
const spawnWord = () => {
  const weightSeconds = state.weight
  const weightMilliseconds = state.weight * 1000
  // pop a word out of the words array and generate a new word element with it
  const newWordDiv = document.createElement('div')
  newWordDiv.innerText = state.words.pop()
  newWordDiv.classList.add('word')
  newWordDiv.setAttribute('id', `${state.timeouts.length}`)
  newWordDiv.style.animationDuration = `${weightSeconds}s`
  // drop word into a lane
  const randomIndex = getRandomNumber(lanesSection.length)
  lanesSection[randomIndex].appendChild(newWordDiv)
  // create a gameover timeout that triggers at the same time as the word completes it's drop animation
  // state.timeouts.push(setTimeout(loseGame, weightMilliseconds))
}

/**
 *
 * @param {HTMLDivElement} el
 */
const destroyWord = (el) => {
  clearInterval(state.timeouts[el.id])
  // calculate score
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
  }
}

const runGame = () => {
  if (state.words.length > 0) {
    spawnWord()
  }
  if (state.words.length === 0) {
    console.log(`win timer set`)
    levelComplete = setTimeout(winGame, state.weight * 1000 + 1000)
    clearInterval(gameId)
  }
}
const loseGame = () => {
  clearTimers()
  loseDialog.showModal()
}
const winGame = () => {
  clearTimers()
  winDialog.showModal()
}

const loadGame = () => {
  // get selected category, randomize words
  state.words = WORD_BANK[categorySelect.selectedOptions[0].innerText].toSorted(
    () => 0.5 - Math.random()
  )

  // get difficulty, set weights, delays
  state.difficulty = DIFFICULTY[difficultySelect.selectedOptions[0].innerText]
  state.weight /= state.difficulty
  state.delay /= state.difficulty

  //start game
  gameId = setInterval(runGame, state.delay)
}

const init = () => {
  // build states
  state = { ...INIT_STATE }
  // clear typing input field
  typingInput.value = ''
  // load menu
  menuDialog.showModal()
}

// load assets
buildCategories()
buildDifficulties()
init()
