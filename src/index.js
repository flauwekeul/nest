import svgjs from 'svg.js';
import { Ant } from './ant';
import { Grid } from './grid';

const rootElement = document.getElementById('main')
const draw = svgjs(rootElement)

const grid = new Grid({ draw })
grid.render({ debug: true })

const { width, height } = draw.bbox()
rootElement.style.width = `${width}px`
rootElement.style.height = `${height}px`

const ant = new Ant({ draw, grid })
const hex = grid.hexes.get([9, 6])
ant.render({ hex })
