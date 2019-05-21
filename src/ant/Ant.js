import { SETTINGS } from '../settings';
import { signedModulo } from '../utils';

// a little shorter than the tick interval to make sure the animation always finishes before the next tick
const animationDuration = SETTINGS.tickInterval - 10

export class Ant {
  constructor({ draw, grid, hex = grid.hexes[0], direction = 0 } = {}) {
    this.draw = draw
    this.grid = grid
    this.hex = hex
    this._setDirection(direction)
  }

  render() {
    // todo: create antSymbol once and use it for each ant
    const { x, y } = this.hexToPoint()
    const antSvg = this.draw.use('ant')
      .addClass('ant')
      .fill('#333')
      .size(40)
      .center(0, 0)
      .rotate(this.direction * 60)
    // create a filler rectangle to make the group occupy the same space as a hex
    const filler = this.draw
      .rect(this.hex.width(), this.hex.height())
      .fill('none')
      .center(0, 0)
    this.svg = this.draw
      .group()
      .center(x, y)
      .add(filler)
      .add(antSvg)

    return this
  }

  hexInFront() {
    // subtract 2 from the direction, because for a honeycomb grid of flat hexes, the 0 direction is "South East"
    return this.grid.hexes.neighborsOf(this.hex, this.direction - 2)[0]
  }

  // todo: also move to hex to the left and right of the hex in front?
  move() {
    this.hex = this.hexInFront()
    const { x, y } = this.hexToPoint()
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

  // 0 is up
  // rotate(direction = 0) {
  //   this.svg
  //     // .animate({ duration: 800 })
  //     .rotate(direction * 60)
  //   return this
  // }

  hexToPoint() {
    return this.hex.center().add(this.hex.toPoint())
  }

  _setDirection(direction = 0) {
    this.direction = signedModulo(direction, 6)
  }
}
