import { PHEROMONE_DROP, TICK_INTERVAL, TILE_TYPES } from '../settings';
import { signedModulo } from '../utils';
import './ant.css';

// a little shorter than the tick interval to make sure the animation always finishes before the next tick
const animationDuration = TICK_INTERVAL - 10

export class Ant {
  constructor({
    draw,
    tile,
    direction = 0,
    surroundingTiles = () => { },
    tileTowardsNest = () => { },
  } = {}) {
    this.draw = draw
    this.tile = tile
    this._setDirection(direction)
    this.surroundingTiles = surroundingTiles
    this.tileTowardsNest = tileTowardsNest
    this.lastTurnDirection = Math.random() < 0.5 ? -1 : 1
    this._currentActivity = () => this.explore()
  }

  render() {
    const { x, y } = this._tileToPoint()
    const antSvg = this.draw.use('ant')
      .addClass('ant')
      .size(40)
      .center(0, 0)
      // add 2 to direction to make it point the same way as a (flat) honeycomb hex
      .rotate((this.direction + 2) * 60)
    // create a filler rectangle to make the group occupy the same space as a tile
    const filler = this.draw
      .rect(this.tile.width(), this.tile.height())
      .addClass('filler')
      .center(0, 0)
    this.svg = this.draw
      .group()
      .center(x, y)
      .add(filler)
      .add(antSvg)

    return this
  }

  tick() {
    this._currentActivity()
    return this
  }

  move(tile) {
    this.tile = tile
    const { x, y } = this._tileToPoint()
    this.svg
      .animate({ duration: animationDuration, ease: '-' })
      .move(x, y)

    return this
  }

  turn(delta) {
    this._setDirection(this.direction + delta)
    this.svg
      .select('.ant')
      .animate({ duration: animationDuration, ease: '-' })
      .transform({ rotation: delta * 60, relative: true })

    return this
  }

  turnTowards({ q, r, s }) {
    const turnDirectionMap = {
      0: r - this.tile.r,
      1: this.tile.q - q,
      2: s - this.tile.s,
      3: this.tile.r - r,
      4: q - this.tile.q,
      5: this.tile.s - s
    }
    const turnDirection = turnDirectionMap[this.direction] || this.lastTurnDirection
    this.turn(turnDirection)

    return this
  }

  leavePheromone() {
    this.tile.addPheromone(PHEROMONE_DROP)
    return this
  }

  explore() {
    // 10% chance to do nothing
    if (Math.random() < 0.1) {
      return
    }

    const tileInFront = this._tileInFront()
    // todo: take chunk of food
    if (tileInFront && tileInFront.food) {
      return this._currentActivity = () => this.take(tileInFront.food)
    }

    // todo: honeycomb: grid.neighborsOf() shouldn't filter out empty hexes and ideally should map each direction to a hex
    const tileInFrontContainingFood = this._tilesInFront().find(tile => tile.food)
    if (tileInFrontContainingFood) {
      return this.turnTowards(tileInFrontContainingFood)
    }

    this._attemptMove(tileInFront)
    return this
  }

  take(contents) {
    this.carrying = contents
    this.svg
      .select('.ant')
      // todo: add something in jaws of ant to show it's carrying something
      .addClass('ant--carrying')
    this._currentActivity = () => this.returnToNest()

    return this
  }

  returnToNest() {
    // todo: leave pheromone on way back to nest
    const tileInFront = this._tileInFront()

    if (tileInFront && tileInFront.type === TILE_TYPES.NEST) {
      return console.log('at nest')
    }

    const tilesInFront = this._tilesInFront()

    if (tilesInFront.length === 0) {
      return this.turn(this.lastTurnDirection)
    }

    const tilesWithPheromone = tilesInFront.filter(tile => tile.pheromone > 0)

    if (tilesWithPheromone.length === 0) {
      return this.turn(this.lastTurnDirection)
    }

    const tileWithMostPheromone = tilesWithPheromone.reduce((prevTile, tile) =>
      tile.pheromone > prevTile.pheromone ? tile : prevTile
    )

    if (tileWithMostPheromone.equals(tileInFront)) {
      return this.move(tileInFront)
    } else {
      return this.turnTowards(tileWithMostPheromone)
    }
  }

  _attemptMove(tile) {
    // when the ant can move forward: 80% chance it will
    // todo: don't move if tile contains another ant?
    if (tile && Math.random() > 0.2) {
      this.leavePheromone()
      return this.move(tile)
    }

    // 80% chance to turn the same direction as last time
    this.lastTurnDirection *= Math.random() > 0.2 ? 1 : -1
    this.turn(this.lastTurnDirection)
  }

  _tileToPoint() {
    return this.tile.center().add(this.tile.toPoint())
  }

  _setDirection(direction = 0) {
    this.direction = signedModulo(direction, 6)
  }

  _tileInFront() {
    return this.surroundingTiles(this.tile, this.direction)[0]
  }

  _tilesInFront() {
    const { direction } = this
    return this.surroundingTiles(this.tile, [direction - 1, direction, direction + 1])
  }
}
