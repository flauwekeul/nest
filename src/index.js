import { defineGrid, extendHex } from 'honeycomb-grid';
import svgjs from 'svg.js';

const rootElement = document.getElementById('main')
const Hex = extendHex({ orientation: 'flat', size: 20 })
const Grid = defineGrid(Hex)

const draw = svgjs(rootElement)
const hexSymbol = draw.symbol()
  .polygon(Hex().corners().map(({ x, y }) => `${x},${y}`))
  .fill('none')
  .stroke({ width: 3, color: '#eee' })

Grid.rectangle({ width: 24, height: 16 }).forEach(hex => {
  const { x, y } = hex.toPoint()
  draw.use(hexSymbol).translate(x, y)
})

const { width, height } = draw.bbox()
rootElement.style.width = `${width}px`
rootElement.style.height = `${height}px`

draw.use('ant')
  .fill('#333')
  .size(32)
