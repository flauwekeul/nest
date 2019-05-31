import svgjs from 'svg.js';
import { Ant } from '../ant';
import { Food } from '../food';
import { Grid } from '../grid';
import { MAX_PHEROMONE, TILE_TYPES } from '../settings';
import './world.css';

export class World {
  get tiles() { return this.grid.hexes }

  constructor({ el, width = 1, height = 1, nestTile } = {}) {
    this.el = el
    this.draw = svgjs(this.el)
    this.grid = new Grid({ draw: this.draw, nestHex: nestTile, width, height })

    // todo: make prettier
    const _nestTile = this.tiles.get(nestTile)
    _nestTile.type = TILE_TYPES.NEST
    _nestTile.pheromone = MAX_PHEROMONE
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
      surroundingTiles: (tile, direction) => this.tiles.neighborsOf(tile, direction),
      // returns first tile the ant should go to in order to return to the nest
      tileTowardsNest: tile => this.tiles.hexesBetween(tile, this.nestTile)[1],
      tile: this.nestTile,
      direction,
    })

    this.ants.push(ant)
    ant.render()

    return this
  }

  addFood({ tile } = {}) {
    const foodTile = this.tiles.get(tile)
    foodTile.food = new Food()

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
    this.grid.tick()

    return this
  }
}
