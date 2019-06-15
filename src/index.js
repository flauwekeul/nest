import reLiftHTML from 'relift-html'
import {
  FOOD_MAX,
  TICK_INTERVAL,
  WORLD_ANTS,
  WORLD_FOODS,
  WORLD_HEIGHT,
  WORLD_NEST_COORDINATES,
  WORLD_WIDTH,
} from './settings'
import { Ticker } from './ticker'
import { randomNumber } from './utils'
import { World } from './world'

const rootElement = document.getElementById('main')
const world = new World({
  el: rootElement,
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  nestCoordinates: WORLD_NEST_COORDINATES,
})
world.render({ debug: false })

for (let i = 0; i < WORLD_FOODS; i++) {
  world.addFood({
    tile: [
      randomNumber(Math.floor(WORLD_WIDTH / 3), WORLD_WIDTH - 1),
      randomNumber(Math.floor(WORLD_HEIGHT / 3), WORLD_HEIGHT - 1),
    ],
    amount: randomNumber(FOOD_MAX * 0.4, FOOD_MAX),
  })
}

for (let i = 0; i < WORLD_ANTS; i++) {
  world.addAnt({ direction: randomNumber(0, 6) })
}

const ticker = new Ticker(() => {
  world.tick()
}, TICK_INTERVAL)

reLiftHTML({
  tagName: 'play-pause-button',
  template: '<button type="button" @click="toggle">{this.text}</button>',
  data: {
    text: ticker.isTicking ? 'Pause' : 'Play',
    disabled: false,
  },
  toggle() {
    ticker.isTicking ? this.pause() : this.play()
  },
  play() {
    this.data.text = 'Pause'
    this.el.setAttribute('disabled', true)
    ticker.play()
  },
  pause() {
    this.data.text = 'Play'
    this.el.removeAttribute('disabled')
    ticker.pause()
  },
})

reLiftHTML({
  tagName: 'tick-button',
  template: '<button type="button" @click="tick">Tick</button>',
  tick() {
    world.tick()
  },
})
