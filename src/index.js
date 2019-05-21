import svgjs from 'svg.js';
import { Ant, Behavior } from './ant';
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

const hex = grid.randomHex()
const direction = randomNumber(0, 6)
const ant = new Ant({ draw, grid, hex, direction })
ant.render()
const behavior = new Behavior({ ant })

setInterval(() => {
  behavior.explore()
}, SETTINGS.tickInterval);
