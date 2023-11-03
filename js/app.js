// lol not ready for vanillaJS typesafety @ts-check

// CONSTANTS

const WORD_BANK = {
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
}

const DIFFICULTY = {
  'new game': 1,
  'new game+': 2,
  'new game++': 3,
}

const INIT_STATE = {
  words: [],
  timeouts: [], // for stashing timeoutIds
  delay: 2000, // milliseconds
  difficulty: 1, //difficulty multiplier
  score: 0,
  wordsLeft: 0,
  gameId: 0,
}

// VARIABLES

let state

// ELEMENTS

const bodyEl = document.querySelector('body')

const menuDialog = document.querySelector('#main-menu')
const optionsDialog = document.querySelector('#options-menu')
const loseDialog = document.querySelector('#rip')
const winDialog = document.querySelector('#win')

const playButton = document.querySelector('#play')
const optionsButton = document.querySelector('#options')

const categorySelect = document.querySelector('#category')
const difficultySelect = document.querySelector('#difficulty')

const optionsMenuButton = document.querySelector('#menu-options')
const ripMenuButton = document.querySelector('#menu-rip')
const winMenuButton = document.querySelector('#menu-win')
const quitButton = document.querySelector('#menu-quit')

const randomizeSvg = document.querySelector('#randomize')

const typingInput = document.querySelector('#typing')

const scoreEls = document.querySelectorAll('.score')
const levelDiv = document.querySelector('#level')

const laneDivs = document.querySelectorAll('#lanes > div')

const ripAudio = document.querySelector('#rip-audio')
const winAudio = document.querySelector('#win-audio')
const playAudio = document.querySelector('#play-audio')
const matchAudio = document.querySelectorAll('.match')
const typoAudio = document.querySelectorAll('.typo')

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

// LISTENERS

bodyEl.addEventListener('mouseup', (e) => {
  if (e.target.id === randomizeSvg.id || e.target.ownerSVGElement) {
    // svg path got in the way of clicking the dice
    randomizeSvg.style.opacity = 0.5
    playButton.style.opacity = 1
  }
})

bodyEl.addEventListener('mousedown', (e) => {
  //set random difficulty and category
  if (e.target.id === randomizeSvg.id || e.target.ownerSVGElement) {
    randomizeSvg.style.opacity = 1
    playButton.style.opacity = 0.5
    difficultySelect.options.selectedIndex = getRandomNumber(
      difficultySelect.length
    )
    categorySelect.options.selectedIndex = getRandomNumber(
      categorySelect.length
    )
    setPlayInnerText()
  }

  // buttons
  if (e.target.id === playButton.id) {
    playAudio.play()
    menuDialog.close()
    bodyEl.style.animationName = 'fadeIn'
    bodyEl.style.animationDuration = '1.5s'
    loadGame()
  }
  if (e.target.id === optionsButton.id) {
    menuDialog.close()
    optionsDialog.showModal()
  }
  if (e.target.id === optionsMenuButton.id) {
    optionsDialog.close()
    init()
  }
  if (e.target.id === ripMenuButton.id) {
    loseDialog.close()
    init()
  }
  if (e.target.id === winMenuButton.id) {
    winDialog.close()
    init()
  }
  if (e.target.id === quitButton.id) {
    loseGame()
  }
})

// capture keydown events
bodyEl.addEventListener('keydown', (e) => {
  // still want my browser refresh and dev tools!
  if (e.key === 'F5' || e.key === 'F12') {
    return
  }
  e.preventDefault()
  // add key to text input element
  if (
    e.key.toLowerCase() === 'q' ||
    e.key.toLowerCase() === 'w' ||
    e.key.toLowerCase() === 'e' ||
    e.key.toLowerCase() === 'r' ||
    e.key.toLowerCase() === 't' ||
    e.key.toLowerCase() === 'y' ||
    e.key.toLowerCase() === 'u' ||
    e.key.toLowerCase() === 'i' ||
    e.key.toLowerCase() === 'o' ||
    e.key.toLowerCase() === 'p' ||
    e.key.toLowerCase() === 'a' ||
    e.key.toLowerCase() === 's' ||
    e.key.toLowerCase() === 'd' ||
    e.key.toLowerCase() === 'f' ||
    e.key.toLowerCase() === 'g' ||
    e.key.toLowerCase() === 'h' ||
    e.key.toLowerCase() === 'j' ||
    e.key.toLowerCase() === 'k' ||
    e.key.toLowerCase() === 'l' ||
    e.key.toLowerCase() === 'z' ||
    e.key.toLowerCase() === 'x' ||
    e.key.toLowerCase() === 'c' ||
    e.key.toLowerCase() === 'v' ||
    e.key.toLowerCase() === 'b' ||
    e.key.toLowerCase() === 'n' ||
    e.key.toLowerCase() === 'm'
  ) {
    typingInput.value += e.key
  }
  // reallow user to backspace out of typed keys
  else if (e.key === 'Backspace') {
    const valueString = `${typingInput.value}`
    typingInput.value = valueString.slice(0, valueString.length - 1)
  }
  // typed word match condition
  else if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
    let match
    const wordEl = document.querySelectorAll('#lanes > div > div')
    wordEl.forEach((word) => {
      if (word.innerText === typingInput.value) {
        destroyWord(word)
        match = true
      }
    })
    if (!match) typoAudio[getRandomNumber(typoAudio.length)].play()
    typingInput.value = null
  }
})

// GAME FUNCTIONS

const spawnWord = () => {
  const dragSeconds =
    (state.delay / 200) * (1 + Math.random() / 2 + state.difficulty / 10) //random spice factor, sorry not sorry
  const dragMilliseconds = dragSeconds * 1000

  // pop a word out of the words array and generate a new word element with it
  const newWordDiv = document.createElement('div')
  newWordDiv.innerText = state.words.pop()
  newWordDiv.classList.add('word')
  newWordDiv.setAttribute('id', state.timeouts.length)
  newWordDiv.style.animationDuration = `${dragSeconds}s`
  newWordDiv.style.backgroundColor = `hsl(${getRandomNumber(360)}, 60%, 15%)`

  // drop word into a lane
  const randomIndex = getRandomNumber(laneDivs.length)
  laneDivs[randomIndex].appendChild(newWordDiv)

  // create a gameover timeout that triggers at the same time the word completes its drop animation
  state.timeouts.push(setTimeout(loseGame, dragMilliseconds))
}

/**
 *
 * @param {HTMLDivElement} el
 */
const destroyWord = (el) => {
  if (state.gameId) {
    matchAudio[getRandomNumber(matchAudio.length)].play()
    clearTimeout(state.timeouts[el.id])
    // calculate score
    state.score += el.innerText.length * 100 * state.difficulty
    scoreEls.forEach((el) => (el.innerText = state.score))
    // decrement wordsLeft counter
    state.wordsLeft--
  }
  //remove word element,
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
const setPlayInnerText = () =>
  (playButton.innerText = `${difficultySelect.selectedOptions[0].innerText} (${categorySelect.selectedOptions[0].innerText})`)

const clearGame = () => {
  clearInterval(state.gameId)
  state.gameId = 0
  const wordDivs = document.querySelectorAll('.word')
  wordDivs.forEach((word) => destroyWord(word))
  typingInput.value = ''
  state.timeouts.forEach((timeout) => clearTimeout(timeout))
  // clear word elements
  INIT_STATE.timeouts = []
  INIT_STATE.words = []
}

const loseGame = () => {
  ripAudio.play()
  loseDialog.showModal()
  clearGame()
}
const winGame = () => {
  winAudio.play()
  winDialog.showModal()
  clearGame()
}

const runGame = () => {
  if (state.words.length > 0) {
    spawnWord()
  }
  if (state.wordsLeft === 0) {
    winGame()
  }
}
const loadGame = () => {
  // get selected category, randomize words
  state.words = WORD_BANK[categorySelect.selectedOptions[0].innerText].toSorted(
    () => 0.5 - Math.random()
  ) // still need to wrap my head around this .sort(() => 0.5 - Math.random()) shenanigans
  state.wordsLeft = state.words.length

  // get difficulty, set states
  state.difficulty = DIFFICULTY[difficultySelect.selectedOptions[0].innerText]
  state.delay /= state.difficulty

  // update ui elements
  levelDiv.innerText = categorySelect.selectedOptions[0].innerText
  scoreEls.forEach((el) => {
    el.innerText = state.score
  })
  //start game
  state.gameId = setInterval(runGame, state.delay)
}

const init = () => {
  // build states
  state = { ...INIT_STATE }
  // replace play button text with category + difficulty
  setPlayInnerText()
  // load menu
  menuDialog.showModal()
}

// pre-init stuff - is there even such a thing as pre-init? revisit this later
buildCategories()
buildDifficulties()
categorySelect.options.selectedIndex = getRandomNumber(categorySelect.length) // randomly set a category before init for spice factor

// initialize game
init()


//helper class is a static class for repetitive actions/definitions