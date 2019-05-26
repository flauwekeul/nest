import svgjs from 'svg.js';
import { Ant } from '../ant';
import { Grid } from '../grid';

export class World {
  get tiles() { return this.grid.hexes }

  constructor({ el, width = 1, height = 1 } = {}) {
    this.el = el
    this.draw = svgjs(this.el)
    this.grid = new Grid({ draw: this.draw, width, height })
    this.ants = []
  }

  render({ debug = false } = {}) {
    this.grid.render({ debug })

    const { width, height } = this.draw.bbox()
    this.el.style.width = `${width}px`
    this.el.style.height = `${height}px`

    return this
  }

  addAnt({ tile = this.tiles[0], direction = 0 } = {}) {
    const ant = new Ant({
      draw: this.draw,
      surroundingTiles: this._surroundingTiles.bind(this),
      tile,
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
        tile.ant = this.ants.find(ant => ant.tile.equals(tile))
        return tile
      })
  }
}
