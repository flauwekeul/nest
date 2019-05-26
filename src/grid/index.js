import { defineGrid, extendHex } from 'honeycomb-grid';
import './grid.css';

export class Grid {
  constructor({ draw, width = 1, height = 1, nestHex } = {}) {
    this.draw = draw
    this.nestHex = nestHex

    const Hex = extendHex({ orientation: 'flat', size: 20 })
    const Grid = defineGrid(Hex)
    this.hexes = Grid.rectangle({ width, height })

    // todo: corners should be on Hex?
    const hexCorners = this.hexes[0].corners()
    this.hexSymbol = draw.symbol().polygon(hexCorners.map(({ x, y }) => `${x},${y}`))
  }

  render({ debug = false } = {}) {
    this.hexes.forEach(hex => {
      const { x, y } = hex.toPoint()
      const hexSvg = this.draw
        .use(this.hexSymbol)
        .addClass('hex')
        .translate(x, y)

      if (hex.equals(this.nestHex)) {
        hexSvg.addClass('hex hex--nest')
      }

      const hexGroup = this.draw.group().add(hexSvg)

      if (debug) {
        const fontSize = 11
        const position = hex.center().add(x, y)
        const coordinates = this.draw
          .text(`${hex.x},${hex.y}`)
          .font({
            size: fontSize,
            anchor: 'middle',
            leading: 1.4,
            fill: '#ccc'
          })
          .translate(position.x, position.y - fontSize)
        hexGroup.add(coordinates)
      }
    })

    return this
  }
}
