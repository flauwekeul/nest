import { defineGrid, extendHex } from 'honeycomb-grid'
import { TILE_TYPES } from '../settings'
import './grid.css'
import { defineTile } from './tile'

export class Grid {
  constructor({ draw, width = 1, height = 1, nestTile } = {}) {
    this.draw = draw
    this.nestTile = nestTile

    const TilePrototype = defineTile(draw)
    const Tile = extendHex(TilePrototype)
    const Grid = defineGrid(Tile)
    this.hexes = Grid.rectangle({
      width,
      height,
      onCreate: hex => {
        if (hex.equals(nestTile)) {
          hex.type = TILE_TYPES.NEST
        }
      },
    })
  }

  render({ debug = false } = {}) {
    // todo: honeycomb: corners should be on Hex?
    const hexCorners = this.hexes[0].corners()
    const svgSymbol = this.draw.symbol().polygon(hexCorners.map(({ x, y }) => `${x},${y}`))
    this.hexes.forEach(hex => hex.render({ svgSymbol, debug }))

    return this
  }
}
