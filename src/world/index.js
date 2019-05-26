import svgjs from 'svg.js';
import { Ant, Behavior } from '../ant';
import { Grid } from '../grid';

export class World {
  get tiles() { return this.grid.hexes }

  constructor({ el, width = 1, height = 1 } = {}) {
    this.el = el
    this.draw = svgjs(this.el)
    this.grid = new Grid({ draw: this.draw, width, height })
    this.ants = []
  }

  render() {
    this.grid.render()

    const { width, height } = this.draw.bbox()
    this.el.style.width = `${width}px`
    this.el.style.height = `${height}px`
  }

  addAnt({ tile = this.tiles[0], direction = 0 } = {}) {
    const ant = new Ant({
      draw: this.draw,
      surroundingTiles: this.surroundingTiles.bind(this),
      tile,
      direction,
    })

    this.ants.push(ant)
    ant.render()

    return this
  }

  surroundingTiles({ tile, direction } = {}) {
    return this.tiles
      .neighborsOf(tile, direction)
      .map(tile => {
        tile.ant = this.ants.find(ant => ant.tile.equals(tile))
        return tile
      })
  }

  tick() {
    this.ants.forEach(ant => {
      // todo: don't instantiate a new Behavior for each ant, should be a singleton
      const behavior = new Behavior({ ant })
      behavior.explore()
    })
    return this
  }
}
