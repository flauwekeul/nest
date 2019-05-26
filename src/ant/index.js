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
    surroundingTiles = () => { }
  } = {}) {
    this.draw = draw
    this.tile = tile
    this._setDirection(direction)
    this.surroundingTiles = surroundingTiles
    this.lastTurnDirection = Math.random() < 0.5 ? -1 : 1
  }

  render() {
    const { x, y } = this._tileToPoint()
    const antSvg = this.draw.use('ant')
      .addClass('ant')
      .size(40)
      .center(0, 0)
      .rotate(this.direction * 60)
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

  // todo: also move to tile to the left and right of the tile in front?
  move() {
    this.tile = this._tileInFront()
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
    // when the ant can move forward: 80% chance it will
    if (tileInFront && !tileInFront.contents && Math.random() > 0.2) {
      this.move()
    } else {
      // 80% chance to turn the same direction as last time
      this.lastTurnDirection *= Math.random() > 0.2 ? 1 : -1
      this.turn(this.lastTurnDirection)
    }
  }

  _tileToPoint() {
    return this.tile.center().add(this.tile.toPoint())
  }

  _setDirection(direction = 0) {
    this.direction = signedModulo(direction, 6)
  }

  _tileInFront() {
    // subtract 2 from the direction, because for a honeycomb grid of flat hexes, the 0 direction is "South East"
    return this.surroundingTiles({ tile: this.tile, direction: this.direction - 2 })[0]
  }
}
