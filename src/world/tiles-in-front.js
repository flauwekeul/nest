import { randomNumber } from '../utils'

/**
 * A class representing the 3 tiles in front of an ant.
 * It's the interface an ant has to "sense" its immediate surroundings.
 */
export class TilesInFront {
  constructor({ tiles, nestTile }) {
    this.center = tiles[0]
    this.left = tiles[1]
    this.right = tiles[2]
    this.tiles = tiles.filter(Boolean)
    this._nestTile = nestTile
  }

  get count() {
    return this.tiles.length
  }

  closestToFood() {
    return this.tiles.sort((a, b) => {
      if (a.food || b.food) {
        return a.food ? -1 : 1
      }

      if (a.pheromone && b.pheromone) {
        // todo: also consider pheromone strength
        return this._distanceToNest(b) - this._distanceToNest(a)
      }

      return a.pheromone ? -1 : 1
    })[0]
  }

  closestToNest() {
    return this.tiles.sort((a, b) => this._distanceToNest(a) - this._distanceToNest(b))[0]
  }

  takeFoodFrom({ tile, amount }) {
    return tile.food.consume(amount)
  }

  withFood() {
    return this.tiles.find(tile => tile.food)
  }

  withPheromone() {
    return this.tiles.find(tile => tile && tile.pheromone > 0)
  }

  random() {
    const { count } = this
    return count > 0 ? this.tiles[randomNumber(0, count - 1)] : null
  }

  // todo: memoize this (or just set it on each tile)
  _distanceToNest(tile) {
    return this._nestTile.distance(tile)
  }
}
