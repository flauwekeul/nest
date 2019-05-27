import { SETTINGS } from './settings';
import { randomNumber } from './utils';
import { World } from './world';

const rootElement = document.getElementById('main')
const world = new World({ el: rootElement, width: 32, height: 16, nestTile: [0, 0] })
world
  .render({ debug: false })
  // .addAnt({ direction: randomNumber(0, 6) })
  .addFood({ tile: [30, 14] })
  .addFood({ tile: [9, 13] })
  .addFood({ tile: [21, 4] })

for (let i = 0; i < 20; i++) {
  world.addAnt({ direction: randomNumber(0, 6) })
}

setInterval(() => {
  world.tick()
}, SETTINGS.tickInterval)
