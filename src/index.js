import { TICK_INTERVAL } from './settings';
import { randomNumber } from './utils';
import { Ticker } from './utils/ticker';
import { World } from './world';

const rootElement = document.getElementById('main')
const world = new World({ el: rootElement, width: 25, height: 15, nestTile: [12, 7] })
world
  .render({ debug: true })
  .addFood({ tile: [1, 0] })
  .addFood({ tile: [23, 13] })

for (let i = 0; i < 5; i++) {
  world.addAnt({ direction: randomNumber(0, 6) })
}

const ticker = new Ticker(() => {
  world.tick()
}, TICK_INTERVAL)
ticker.play()

// todo: use some kind of components to make this less shitty
const playPauseButton = document.getElementById('play-pause-button')
playPauseButton.addEventListener('click', () => {
  if (ticker.isTicking) {
    playPauseButton.innerHTML = 'Play'
    tickButton.removeAttribute('disabled')
  } else {
    playPauseButton.innerHTML = 'Pause'
    tickButton.setAttribute('disabled', true)
  }

  ticker.toggle()
})

const tickButton = document.getElementById('tick-button')
tickButton.addEventListener('click', () => {
  if (!ticker.isTicking) {
    world.tick()
  }
})
