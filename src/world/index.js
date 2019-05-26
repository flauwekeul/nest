import svgjs from 'svg.js';
import { Ant } from '../ant';
import { Grid } from '../grid';

export class World {
  get tiles() { return this.grid.hexes }

  constructor({ el, width = 1, height = 1, nestTile } = {}) {
    this.el = el
    this.draw = svgjs(this.el)
    this.grid = new Grid({ draw: this.draw, nestHex: nestTile, width, height })
    this.nestTile = this.tiles.get(nestTile)
    this.ants = []
  }

  render({ debug = false } = {}) {
    this.grid.render({ debug })

    const { width, height } = this.draw.bbox()
    this.el.style.width = `${width}px`
    this.el.style.height = `${height}px`

    return this
  }

  addAnt({ direction = 0 } = {}) {
    const ant = new Ant({
      draw: this.draw,
      surroundingTiles: this._surroundingTiles.bind(this),
      tile: this.nestTile,
      direction,
    })

    this.ants.push(ant)
    ant.render()

    return this
  }

  tick() {
    this.ants.forEach(ant => {
      ant.explore()
    })
    return this
  }

  _surroundingTiles({ tile, direction } = {}) {
    return this.tiles
      .neighborsOf(tile, direction)
      .map(tile => {
        tile.contents = this._contentsForTile(tile)
        return tile
      })
  }

  _contentsForTile(tile) {
    if (tile.equals(this.nestTile)) {
      return this.nestTile
    }

    if (this.ants.length > 1) {
      return this.ants.find(ant => ant.tile.equals(tile))
    }
  }
}
