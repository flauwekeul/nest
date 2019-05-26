import { SETTINGS } from './settings';
import { randomNumber } from './utils';
import { World } from './world';

const rootElement = document.getElementById('main')
const world = new World({ el: rootElement, width: 6, height: 4 })
world.render()

for (let i = 0; i < 4; i++) {
  world.addAnt({ tile: world.tiles[i], direction: randomNumber(0, 6) })
}

setInterval(() => {
  world.tick()
}, SETTINGS.tickInterval)
