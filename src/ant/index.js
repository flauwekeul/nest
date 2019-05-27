import { SETTINGS } from '../settings';
import { signedModulo } from '../utils';
import './ant.css';

// a little shorter than the tick interval to make sure the animation always finishes before the next tick
const animationDuration = SETTINGS.tickInterval - 10

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

  explore() {
    // 10% chance to do nothing
    if (Math.random() < 0.1) {
      return
    }

    const tileInFront = this._tileInFront()
    // todo: make prettier
    if (tileInFront && tileInFront.contents && tileInFront.contents.type === 'food') {
      return this._currentActivity = () => this.take(tileInFront.contents)
    }

    this._attemptMove(tileInFront)
  }

  take(contents) {
    this.carrying = contents
    this.svg
      .select('.ant')
      // todo: add something in jaws of ant to show it's carrying something
      .addClass('ant--carrying')
    this._currentActivity = () => this.returnToNest()
  }

  returnToNest() {
    if (Math.random() < 0.2) {
      return this._attemptMove()
    }

    // todo: follow pheromone track
    const tileTowardsNest = this.tileTowardsNest(this.tile)
    const tileInFront = this._tileInFront()
    tileTowardsNest.equals(tileInFront)
      ? this._attemptMove(tileInFront)
      // todo: turn towards nest instead of always lastTurnDirection
      : this.turn(this.lastTurnDirection)
  }

  _attemptMove(tileInFront = this._tileInFront()) {
    // when the ant can move forward: 80% chance it will
    if (tileInFront && !tileInFront.contents && Math.random() > 0.2) {
      return this.move(tileInFront)
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
    return this.surroundingTiles({ tile: this.tile, direction: this.direction })[0] || null
  }
}
