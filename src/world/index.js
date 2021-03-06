import svgjs from 'svg.js'
import { Ant } from '../ant'
import { FOOD_MAX } from '../settings'
import { signedModulo } from '../utils'
import { Food } from './food'
import { Grid } from './grid'
import { TilesInFront } from './tiles-in-front'
import './world.css'

const DIRECTION_COORDINATES = [
  { q: 1, r: 0 },
  { q: 0, r: 1 },
  { q: -1, r: 1 },
  { q: -1, r: 0 },
  { q: 0, r: -1 },
  { q: 1, r: -1 },
]
// own version of Grid.neighborsOf() that doesn't filter non-existent hexes. This is fixed in honeycomb 3.0
const surroundingTiles = (tiles, tile, directions) =>
  [].concat(directions).map(direction => {
    if (direction < 0 || direction > 5) {
      direction = signedModulo(direction, 6)
    }
    const { q, r } = DIRECTION_COORDINATES[direction]
    return tiles.get(tile.cubeToCartesian({ q: tile.q + q, r: tile.r + r }))
  })

export class World {
  get tiles() {
    return this.grid.hexes
  }

  constructor({ el, width = 1, height = 1, nestCoordinates } = {}) {
    this.el = el
    this.draw = svgjs(this.el)
    this.grid = new Grid({ draw: this.draw, nestCoordinates, width, height })
    this.nestTile = this.tiles.get(nestCoordinates)
    this.ants = []
  }

  render() {
    // todo: don't render all hexes, but only the ants, foods and pheromones
    this.grid.render()

    const { width, height } = this.draw.bbox()
    this.el.style.width = `${width}px`
    this.el.style.height = `${height}px`

    return this
  }

  addAnt({ tile = this.nestTile, direction = 0 } = {}) {
    const { draw, nestTile } = this
    const ant = new Ant({
      draw,
      tile: this.tiles.get(tile),
      direction,
      getTilesInFront: (tile, direction) => {
        // get tiles in order: center, left, right
        const tiles = surroundingTiles(this.tiles, tile, [direction, direction - 1, direction + 1])
        const antsOnTiles = tiles.map(tile => this.ants.find(ant => ant.tile.equals(tile))).filter(Boolean)
        return new TilesInFront({ tiles, nestTile, antsOnTiles })
      },
    })

    this.ants.push(ant)
    ant.render()

    return this
  }

  addFood({ tile, amount = FOOD_MAX } = {}) {
    tile = this.tiles.get(tile)
    const food = new Food({ draw: this.draw, tile, amount })
    food.render()
    tile.food = food

    return this
  }

  tick() {
    this.tiles.forEach(tile => tile.tick())
    this.ants.forEach(ant => ant.tick())

    return this
  }
}
