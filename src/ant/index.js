import { PHEROMONE_DROP } from '../settings'
import { signedModulo } from '../utils'
import './ant.css'

export class Ant {
  constructor({ draw, tile, direction = 0, getTilesInFront = () => [] } = {}) {
    this.draw = draw
    this.tile = tile
    this.nestTile = tile
    this.getTilesInFront = getTilesInFront
    this.carryCapacity = 100
    this._setDirection(direction)
    this._setBehavior('explore')
  }

  render() {
    const { x, y } = this._tileToPoint()
    const antGraphic = this.draw
      .use('ant')
      .addClass('ant__graphic')
      .size(this.tile.height())
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

    this.tilesInFront = this.getTilesInFront(this.tile, this.direction)
    this._currentBehavior()
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

  turnRandom() {
    return this.turn(this._randomRotation())
  }

  turnTowards(tile) {
    if (tile.equals(this.tilesInFront.center)) {
      return this
    }

    const { q, r, s } = tile
    const rotationMap = {
      0: r - this.tile.r,
      1: this.tile.q - q,
      2: s - this.tile.s,
      3: this.tile.r - r,
      4: q - this.tile.q,
      5: this.tile.s - s,
    }
    const rotation = rotationMap[this.direction] || this._randomRotation()
    this.turn(rotation)

    return this
  }

  takeFood(tile) {
    this.carrying = this.tilesInFront.takeFoodFrom({ tile, amount: this.carryCapacity })
    this.svg
      .select('.ant__graphic')
      // todo: add something in jaws of ant to show it's carrying something
      .addClass('ant__graphic--carrying')

    return this
  }

  drop() {
    // todo: do something with dropped food
    this.carrying = null
    this.svg.select('.ant__graphic').removeClass('ant__graphic--carrying')

    return this
  }

  // BEHAVIORS

  explore() {
    const { tilesInFront } = this
    if (tilesInFront.count === 0) {
      return this.turnRandom()
    }

    const tileWithFoodOrPheromone = tilesInFront.withFood() || tilesInFront.withPheromone()
    if (tileWithFoodOrPheromone) {
      this.turnTowards(tileWithFoodOrPheromone)
      this._setBehavior('goToFood')
      return this
    }

    const { center } = tilesInFront
    const nextTile = center && Math.random() > 0.3 ? center : tilesInFront.random()
    this._doOrTurnTowards(nextTile, () => this.move(nextTile))
  }

  returnToNest() {
    if (this.tile.isNest()) {
      // todo: don't assume ant is carrying food?
      this.drop()
      return this._setBehavior('turnAround', this.direction, this._randomRotation())
    }

    const { tilesInFront } = this
    if (tilesInFront.count === 0) {
      return this.turnRandom()
    }

    const nextTile = tilesInFront.closestToNest()
    this._doOrTurnTowards(nextTile, () => {
      this.tile.addPheromone(PHEROMONE_DROP)
      return this.move(nextTile)
    })
  }

  goToFood() {
    const { tilesInFront } = this
    if (tilesInFront.count === 0) {
      return this.turnRandom()
    }

    // end of trail and no food around (anymore)
    if (!tilesInFront.withPheromone() && !tilesInFront.withFood()) {
      return this._setBehavior('explore')
    }

    const tileWithFood = tilesInFront.withFood()
    if (tileWithFood && tileWithFood.equals(tilesInFront.center)) {
      return this.takeFood(tileWithFood)._setBehavior('returnToNest')
    }

    const nextTile = tilesInFront.closestToFood()
    return this._doOrTurnTowards(nextTile, () => this.move(nextTile))
  }

  turnAround(startDirection = this.direction, rotation = this._randomRotation()) {
    if (this.direction === signedModulo(startDirection + 3, 6)) {
      // todo: make it possible to specify the behavior when the ant finishes to turn around?
      return this._setBehavior('explore')
    }
    this.turn(rotation)

    return this
  }

  // PRIVATES

  _tileToPoint() {
    return this.tile.center().add(this.tile.toPoint())
  }

  _setDirection(direction = 0) {
    this.direction = signedModulo(direction, 6)
  }

  _setBehavior(behavior, ...args) {
    this._currentBehavior = () => this[behavior](...args)
  }

  _randomRotation() {
    return Math.random() > 0.5 ? 1 : -1
  }

  /**
   * If the passed tile is in front of the ant: call callback, else: turn towards the tile
   */
  _doOrTurnTowards(tile, callback) {
    if (tile.equals(this.tilesInFront.center)) {
      return callback()
    }
    return this.turnTowards(tile)
  }
}
