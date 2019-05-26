import { SETTINGS } from './settings';
import { randomNumber } from './utils';
import { World } from './world';

const rootElement = document.getElementById('main')
const world = new World({ el: rootElement, width: 40, height: 16, nestTile: [2, 2] })
world
  .render()
  .addAnt({ direction: randomNumber(0, 6) })

// for (let i = 0; i < 4; i++) {
//   world.addAnt({ direction: randomNumber(0, 6) })
// }

setInterval(() => {
  world.tick()
}, SETTINGS.tickInterval)
