import svgjs from 'svg.js';
import { Colony } from './colony';
import { Grid } from './grid';
import { SETTINGS } from './settings';
import { randomNumber } from './utils';

const rootElement = document.getElementById('main')
const draw = svgjs(rootElement)

const grid = new Grid({ draw })
grid.render()

const { width, height } = draw.bbox()
rootElement.style.width = `${width}px`
rootElement.style.height = `${height}px`

const colony = new Colony({ draw, grid })
colony
  .addAnt({ hex: grid.randomHex(), direction: randomNumber(0, 6) })
  .addAnt({ hex: grid.randomHex(), direction: randomNumber(0, 6) })
  .addAnt({ hex: grid.randomHex(), direction: randomNumber(0, 6) })
  .addAnt({ hex: grid.randomHex(), direction: randomNumber(0, 6) })
  .addAnt({ hex: grid.randomHex(), direction: randomNumber(0, 6) })
  .render()

setInterval(() => {
  colony.tick()
}, SETTINGS.tickInterval);
