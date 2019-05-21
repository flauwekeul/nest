import { defineGrid, extendHex } from 'honeycomb-grid';
import { randomNumber } from '../utils';

export class Grid {
  constructor({ draw } = {}) {
    this.draw = draw
    this.svgs = []

    const Hex = extendHex({ orientation: 'flat', size: 20 })
    const Grid = defineGrid(Hex)
    this.hexes = Grid.rectangle({ width: 24, height: 16 })

    // todo: corners should be on Hex?
    const hexCorners = this.hexes[0].corners()
    this.hexSymbol = draw.symbol()
      .polygon(hexCorners.map(({ x, y }) => `${x},${y}`))
      .fill('none')
      .stroke({ width: 3, color: '#eee' })
  }

  render({ debug = false } = {}) {
    this.hexes.forEach(hex => {
      const { x, y } = hex.toPoint()
      const hexSvg = this.draw
        .use(this.hexSymbol)
        .translate(x, y)
      const group = this.draw.group().add(hexSvg)

      if (debug) {
        const fontSize = 11
        const position = hex.center().add(x, y)
        this.draw
          .text(`${hex.x},${hex.y}`)
          .font({
            size: fontSize,
            anchor: 'middle',
            leading: 1.4,
            fill: '#ccc'
          })
          .translate(position.x, position.y - fontSize)
      }

      this.svgs.push(group)
    })

    return this
  }

  randomHex() {
    return this.hexes[randomNumber(0, this.hexes.length - 1)]
  }
}
