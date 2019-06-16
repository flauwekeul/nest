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
import { createPlayPauseButton, createTickButton } from './ui'
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

createPlayPauseButton(ticker)
createTickButton(world)
