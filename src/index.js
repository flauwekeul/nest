import svgjs from 'svg.js';
import { Colony } from './colony';
import { Grid } from './grid';
import { SETTINGS } from './settings';
import { randomNumber } from './utils';

const rootElement = document.getElementById('main')
const draw = svgjs(rootElement)

const grid = new Grid({ draw, width: 6, height: 4 })
grid.render()

const { width, height } = draw.bbox()
rootElement.style.width = `${width}px`
rootElement.style.height = `${height}px`

const colony = new Colony({ draw, grid })
for (let i = 0; i < 4; i++) {
  colony.addAnt({ hex: grid.hexes[i], direction: randomNumber(0, 6) })
}
colony.render()

setInterval(() => {
  colony.tick()
}, SETTINGS.tickInterval)
