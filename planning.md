## Your choice of game.

Typing Game (not in the Project 1 list)

A typing game where the player has to successfully type words falling from the top of the screen before they fall below the line at the bottom of the screen.

The player is given a set amount of words and difficulty will increase over time (words fall faster, spawn interval shortens)

## User Stories

1. as a Player, i want words to spawn on the screen
1. as a Player, i want to be able to type words into an input field as a way destroy words on the screen
1. as a Player, i want the words to spawn one-at-a-time at a set interval
1. as a Player, i want the words to spawn from the top of the screen and to fall to the bottom of the screen
1. as a Player, i want the game to end if a word falls to the bottom of the screen
1. as a Player, i want the words to randomly spawn at a random spot from the top of the screen
1. as a Player, i want to be able to start the game when i am ready
1. as a Player, i want to be able to read the rules on how to play the game
1. as a Player, i do not want the same word appearing multiple times on the screen

## A wireframe of your "main" game screen.

![Alt text](assets/mid-typing-game-wireframe.png)

## Pseudocode for the overall game play.

### Data

- wordbank string[] of words, maybe from 'lorem ipsum' for starters
- gameTime = 0
- count = 0
- difficulty = 1
- words = string[] to keep track of words spawned

### Cached Elements

- text input
- nodelist of flexColumns

### Listeners

- buttons - for starting the game
- input - listen for keydown 'enter'

### Functions

- generateRandomNumber(number)
  - use to pick out random words from the wordbank by passing in the length of the wordbank[] to generate a random position index
- gameOver() - clearinterval
- increaseDifficulty()
  - increment velocity and interval based on gameTime value
- spawnWord(velocity)
  1. columnIndex = generateRandomNumber(numberOfLanes)
  1. word = wordbank[generateRandomNumber(wordbank.length)]
  1. createElement div
     1. CSS style with transition/transform value based on velocity
     1. setAttribute('id', 'w'+'index')
  1. words.push(word)
  1. setTimeout(gameOver, velocity)
  1. flexboxColumn[columnIndex].appendChild(word)
- inputHandler()
  - word
- destroyWord(w#)
  1. element.remove(w#)
  1. clearTimeout(w#)
- runGame
    1. spawnWord
    1. increaseDifficulty

### Init

pre-init: user selects button to start game

1. game initializes
   1. set states
      - velocity
      - count
      - difficulty
      - interval
   1. setInterval(runGame, interval)

## Icebox stuff

- end of level to give player a break before continuing to next level
  - levels will have a set number of words to be typed
- counter for words typed / score ?
  - top 10 scores?
- music ?
- sound effects ?
  - one for successfully typing words
  - one for typing words that aren't on the screen
