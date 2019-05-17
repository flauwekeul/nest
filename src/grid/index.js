import { defineGrid, extendHex } from 'honeycomb-grid';

export default class Grid {
  constructor() {
    const Hex = extendHex({ orientation: 'flat', size: 20 })
    const Grid = defineGrid(Hex)
    this.svgs = []
    this.hexes = Grid.rectangle({ width: 24, height: 16 })
  }

  render({ draw }) {
    // todo: corners should be on Hex?
    const hexCorners = this.hexes[0].corners()
    const hexSymbol = draw.symbol()
      .polygon(hexCorners.map(({ x, y }) => `${x},${y}`))
      .fill('none')
      .stroke({ width: 3, color: '#eee' })

    this.hexes.forEach(hex => {
      const { x, y } = hex.toPoint()
      this.svgs.push(draw.use(hexSymbol).translate(x, y))
    })

    return this
  }
}
