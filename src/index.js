import svgjs from 'svg.js';
import Ant from './ant';
import Grid from './grid';

const rootElement = document.getElementById('main')
const draw = svgjs(rootElement)

const grid = new Grid()
grid.render({ draw })

const { width, height } = draw.bbox()
rootElement.style.width = `${width}px`
rootElement.style.height = `${height}px`

const hex = grid.hexes[0]
const ant = new Ant({ hex })
ant.render({ draw })
