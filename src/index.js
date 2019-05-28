import { TICK_INTERVAL } from './settings';
import { randomNumber } from './utils';
import { World } from './world';

const rootElement = document.getElementById('main')
const world = new World({ el: rootElement, width: 20, height: 10, nestTile: [0, 0] })
world
  .render({ debug: true })
  .addFood({ tile: [4, 7] })
  .addFood({ tile: [12, 1] })
  .addFood({ tile: [16, 9] })

for (let i = 0; i < 5; i++) {
  world.addAnt({ direction: randomNumber(0, 6) })
}

// let count = 0
const intervalId = setInterval(() => {
  // count++
  // if (count > 20) {
  //   clearInterval(intervalId)
  // }
  world.tick()
}, TICK_INTERVAL)
