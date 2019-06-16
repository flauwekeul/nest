import { defineGrid, extendHex } from 'honeycomb-grid'
import { TILE_TYPES } from '../../settings'
import { defineTile } from './tile'

export class Grid {
  constructor({ draw, width = 1, height = 1, nestCoordinates } = {}) {
    this.draw = draw

    const TilePrototype = defineTile(draw)
    const Tile = extendHex(TilePrototype)
    const Grid = defineGrid(Tile)
    this.hexes = Grid.rectangle({
      width,
      height,
      onCreate: hex => {
        if (hex.equals(nestCoordinates)) {
          hex.type = TILE_TYPES.NEST
        }
      },
    }).map((hex, i, hexes) => {
      // pre-calculate distance to nest for each hex
      // todo: honeycomb: make distance accept a point as well
      hex.distanceToNest = hex.distance(hexes.get(nestCoordinates))
      return hex
    })

    this.isShowingCoordinates = false
  }

  render() {
    // todo: honeycomb: corners should be on Hex?
    const hexCorners = this.hexes[0].corners()
    const svgSymbol = this.draw.symbol().polygon(hexCorners.map(({ x, y }) => `${x},${y}`))
    this.hexes.forEach(hex => hex.render({ svgSymbol }))

    return this
  }

  toggleCoordinates() {
    this.isShowingCoordinates = !this.isShowingCoordinates
    this.hexes.forEach(hex => hex.toggleCoordinates())
  }
}
