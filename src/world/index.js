import svgjs from 'svg.js';
import { Ant } from '../ant';
import { Grid } from '../grid';
import './world.css';

export class World {
  get tiles() { return this.grid.hexes }

  constructor({ el, width = 1, height = 1, nestTile } = {}) {
    this.el = el
    this.draw = svgjs(this.el)
    this.grid = new Grid({ draw: this.draw, nestHex: nestTile, width, height })

    // todo: make prettier
    const _nestTile = this.tiles.get(nestTile)
    _nestTile.type = 'nest'
    this.nestTile = _nestTile
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
      tileTowardsNest: this._tileTowardsNest.bind(this),
      tile: this.nestTile,
      direction,
    })

    this.ants.push(ant)
    ant.render()

    return this
  }

  addFood({ tile } = {}) {
    // todo: make prettier
    const foodTile = this.tiles.get(tile)
    foodTile.type = 'food'
    this.foodTile = foodTile

    // todo: this is duplicated in ant.js
    const { x, y } = foodTile.center().add(foodTile.toPoint())
    this.draw
      .circle(foodTile.width() * 0.8, foodTile.height() * 0.8)
      .addClass('food')
      .center(x, y)

    return this
  }

  tick() {
    this.ants.forEach(ant => {
      ant.tick()
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

    if (tile.equals(this.foodTile)) {
      return this.foodTile
    }

    if (this.ants.length > 1) {
      return this.ants.find(ant => ant.tile.equals(tile))
    }
  }

  // returns first tile the ant should go to in order to return to the nest
  _tileTowardsNest(tile) {
    return this.tiles.hexesBetween(tile, this.nestTile)[1]
  }
}
