import { FOOD_MAX, TICK_INTERVAL } from './settings'
import { randomNumber } from './utils'
import { Ticker } from './utils/ticker'
import { World } from './world'

const rootElement = document.getElementById('main')
const world = new World({ el: rootElement, width: 25, height: 15, nestTile: [2, 2] })
world
  .render({ debug: false })
  .addFood({ tile: [randomNumber(13, 24), randomNumber(6, 14)], amount: randomNumber(FOOD_MAX * 0.4, FOOD_MAX) })
  .addFood({ tile: [randomNumber(13, 24), randomNumber(6, 14)], amount: randomNumber(FOOD_MAX * 0.4, FOOD_MAX) })

for (let i = 0; i < 1; i++) {
  world.addAnt({ direction: randomNumber(0, 6) })
}

const ticker = new Ticker(() => {
  world.tick()
}, TICK_INTERVAL)

// todo: use some kind of components to make this less shitty
const playPauseButton = document.getElementById('play-pause-button')
playPauseButton.addEventListener('click', () => {
  ticker.isTicking ? pause() : play()
})

const tickButton = document.getElementById('tick-button')
tickButton.addEventListener('click', () => {
  if (!ticker.isTicking) {
    world.tick()
  }
})

pause()

function play() {
  playPauseButton.innerHTML = 'Pause'
  tickButton.setAttribute('disabled', true)
  ticker.play()
}

function pause() {
  playPauseButton.innerHTML = 'Play'
  tickButton.removeAttribute('disabled')
  ticker.pause()
}
