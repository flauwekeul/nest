import { PHEROMONE_MAX } from '../settings'
import { randomNumber } from '../utils'

/**
 * A class representing the 3 tiles in front of an ant.
 * It's the interface an ant has to "sense" its immediate surroundings.
 */
export class TilesInFront {
  constructor({ tiles = [], nestTile, antsOnTiles = [] }) {
    this.center = tiles[0]
    this.left = tiles[1]
    this.right = tiles[2]
    this.tiles = tiles.filter(Boolean)
    this._nestTile = nestTile
    this._ants = antsOnTiles
  }

  get count() {
    return this.tiles.length
  }

  hasAntInCenter() {
    return this._ants.some(ant => ant.tile.equals(this.center))
  }

  closestToFood() {
    return this.tiles.sort((a, b) => {
      if (a.food || b.food) {
        return a.food ? -1 : 1
      }

      if (a.pheromone && b.pheromone) {
        // go to strongest pheromone if the difference is significant
        return Math.abs(a.pheromone - b.pheromone) > PHEROMONE_MAX * 0.1
          ? b.pheromone - a.pheromone
          : b.distanceToNest - a.distanceToNest
      }

      return a.pheromone ? -1 : 1
    })[0]
  }

  closestToNest() {
    const priorityTiles = this.tiles.filter(tile => tile.isNest() || tile.pheromone > 0)
    return (priorityTiles.length > 0 ? priorityTiles : this.tiles).sort(
      (a, b) => a.distanceToNest - b.distanceToNest,
    )[0]
  }

  takeFoodFrom({ tile, amount }) {
    return tile.food.consume(amount)
  }

  withFood() {
    return this.tiles.find(tile => tile.food)
  }

  withPheromone() {
    return this.tiles.find(tile => tile.pheromone > 0)
  }

  random() {
    const { count } = this
    return count > 0 ? this.tiles[randomNumber(0, count - 1)] : null
  }
}
