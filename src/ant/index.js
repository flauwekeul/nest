import { PHEROMONE_DROP, TILE_TYPES } from '../settings'
import { randomNumber, signedModulo } from '../utils'
import './ant.css'

export class Ant {
  constructor({ draw, tile, direction = 0, surroundingTiles = () => [] } = {}) {
    this.draw = draw
    this.tile = tile
    this.nestTile = tile
    this._setDirection(direction)
    this.surroundingTiles = surroundingTiles
    // fixme: use finite state machine pattern or find another way to untangle this spaghetti
    this._currentActivity = () => this.explore()
    this.carryCapacity = 100
  }

  render() {
    const { x, y } = this._tileToPoint()
    const antGraphic = this.draw
      .use('ant')
      .addClass('ant__graphic')
      .size(40)
      .center(0, 0)
      // add 2 to direction to make it point the same way as a (flat) honeycomb hex
      .rotate((this.direction + 2) * 60)
    // create a filler rectangle to make the group occupy the same space as a tile
    const filler = this.draw
      .rect(this.tile.width(), this.tile.height())
      .addClass('ant__filler')
      .center(0, 0)
    this.svg = this.draw
      .group()
      .center(x, y)
      .add(filler)
      .add(antGraphic)

    // prevent CSS transition when ant is first rendered
    setTimeout(() => this.svg.addClass('ant'), 0)

    return this
  }

  tick() {
    // 10% chance to do nothing
    // todo: use this to "sense" multiple tiles?
    if (Math.random() < 0.1) {
      return this
    }

    const { direction } = this
    this.tilesInFront = this.surroundingTiles(this.tile, [direction - 1, direction, direction + 1])
    if (this.tilesInFront.length === 0) {
      return this.turn(this._randomDirection())
    }

    this._currentActivity()
    return this
  }

  move(tile) {
    this.tile = tile
    const { x, y } = this._tileToPoint()
    this.svg.move(x, y)

    return this
  }

  turn(delta) {
    this._setDirection(this.direction + delta)
    this.svg.select('.ant__graphic').transform({ rotation: delta * 60, relative: true })

    return this
  }

  turnTowards(tile) {
    if (tile.equals(this._tileInFront())) {
      return this
    }

    const { q, r, s } = tile
    const turnDirectionMap = {
      0: r - this.tile.r,
      1: this.tile.q - q,
      2: s - this.tile.s,
      3: this.tile.r - r,
      4: q - this.tile.q,
      5: this.tile.s - s,
    }
    const turnDirection = turnDirectionMap[this.direction] || this._randomDirection()
    this.turn(turnDirection)

    return this
  }

  takeFood(tile) {
    this.carrying = tile.food.consume(this.carryCapacity)
    this.svg
      .select('.ant__graphic')
      // todo: add something in jaws of ant to show it's carrying something
      .addClass('ant__graphic--carrying')
    this._currentActivity = () => this.returnToNest()

    return this
  }

  drop() {
    // todo: do something with dropped food
    this.carrying = null
    this.svg.select('.ant__graphic').removeClass('ant__graphic--carrying')
    this._currentActivity = () => this.goToFood()

    return this
  }

  // BEHAVIORS

  explore() {
    const { tilesInFront } = this
    const frontTileWithFood = tilesInFront.find(tile => tile.food)
    if (frontTileWithFood) {
      return this._doOrTurnTowards(frontTileWithFood, () => this.takeFood(frontTileWithFood))
    }

    if (tilesInFront.some(({ food, pheromone }) => food || pheromone > 0)) {
      return (this._currentActivity = () => this.goToFood())
    }

    const tileInFront = this._tileInFront()
    const nextTile =
      tileInFront && Math.random() > 0.3 ? tileInFront : tilesInFront[randomNumber(0, tilesInFront.length - 1)]
    this._doOrTurnTowards(nextTile, () => this.move(nextTile))
  }

  // todo: randomly go different direction to make it less perfect?
  // todo: when there's already a trail, follow it instead of using tileTowardsNest?
  returnToNest() {
    const { tile, tilesInFront } = this
    const tileClosestToNest = tilesInFront.sort((a, b) => this._distanceToNest(a) - this._distanceToNest(b))[0]

    if (tile.type === TILE_TYPES.NEST) {
      return this.drop()
    }

    if (tileClosestToNest) {
      this._doOrTurnTowards(tileClosestToNest, () => {
        tile.addPheromone(PHEROMONE_DROP)
        return this.move(tileClosestToNest)
      })
    }
  }

  goToFood() {
    const tileInFront = this._tileInFront()
    if (tileInFront && tileInFront.food) {
      return this.takeFood(tileInFront)
    }

    const { tilesInFront } = this
    const nextTile = tilesInFront.sort((a, b) => {
      if (a.food || b.food) {
        return a.food ? -1 : 1
      }
      if (!a.pheromone && !b.pheromone) {
        // in this state there's no pheromone in front of the ant, either because it's at the nest
        // or because it's at the end of the trail and the food is gone
        // todo: think of a way to start exploring again instead of aimlessly following the trail back
        return
      }
      if (a.pheromone && b.pheromone) {
        // todo: also consider pheromone strength
        return this._distanceToNest(b) - this._distanceToNest(a)
      }
      return a.pheromone ? -1 : 1
    })[0]
    return this._doOrTurnTowards(nextTile, () => this.move(nextTile))
  }

  // PRIVATES

  _tileToPoint() {
    return this.tile.center().add(this.tile.toPoint())
  }

  _setDirection(direction = 0) {
    this.direction = signedModulo(direction, 6)
  }

  _randomDirection() {
    return Math.random() > 0.5 ? 1 : -1
  }

  _tileInFront() {
    return this.surroundingTiles(this.tile, this.direction)[0]
  }

  /**
   * If the passed tile is in front of the ant: call callback, else: turn towards the tile
   */
  _doOrTurnTowards(tile, callback) {
    if (tile.equals(this._tileInFront())) {
      return callback()
    }
    return this.turnTowards(tile)
  }

  // todo: memoize this (or just set it on each tile)
  _distanceToNest(tile) {
    return this.nestTile.distance(tile)
  }
}
