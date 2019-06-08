import svgjs from 'svg.js'
import { Ant } from '../ant'
import { Food } from '../food'
import { Grid } from '../grid'
import { FOOD_MAX } from '../settings'
import './world.css'

const DIRECTION_COORDINATES = [
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -1, r: 1 },
  { q: -1, r: 0 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
]

export class World {
  get tiles() {
    return this.grid.hexes
  }

  constructor({ el, width = 1, height = 1, nestTile } = {}) {
    this.el = el
    this.draw = svgjs(this.el)
    this.grid = new Grid({ draw: this.draw, nestTile, width, height })

    this.nestTile = this.tiles.get(nestTile)
    this.ants = []
    this.foods = []
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
      // surroundingTiles: (tile, directions = [0, 1, 2, 3, 4, 5]) => [].concat(directions).map(direction => {
      //   if (direction < 0 || direction > 5) {
      //     direction = signedModulo(direction, 6)
      //   }
      //   const { q, r } = DIRECTION_COORDINATES[direction]
      //   return this.tiles.get(tile.cubeToCartesian({ q: tile.q + q, r: tile.r + r }))
      // }),
      // returns first tile the ant should go to in order to return to the nest
      tile: this.nestTile,
      direction,
    })

    this.ants.push(ant)
    ant.render()

    return this
  }

  addFood({ tile, amount = FOOD_MAX } = {}) {
    const food = new Food({ draw: this.draw, tile: this.tiles.get(tile), amount })
    food.render()
    this.foods.push(food)

    return this
  }

  tick() {
    this.tiles.forEach(tile => tile.tick())
    this.ants.forEach(ant => ant.tick())
    // remove all "empty" food
    this.foods = this.foods.filter(food => (food.amount < 1 && food.beforeDelete(), true))

    return this
  }
}
