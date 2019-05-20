import { signedModulo } from '../utils';

export class Ant {
  constructor({ draw, grid }) {
    this.draw = draw
    this.grid = grid
    this._setDirection(0)
  }

  render({ hex }) {
    this.hex = hex
    // todo: create antSymbol once and use it for each ant
    const { x, y } = this.hexToPoint()
    const antSvg = this.draw.use('ant')
      .addClass('ant')
      .fill('#333')
      .size(32)
      .center(0, 0)
    // create a filler rectangle to make the group occupy the same space as a hex
    const filler = this.draw
      .rect(hex.width(), hex.height())
      .fill('none')
      .center(0, 0)
    this.svg = this.draw
      .group()
      .center(x, y)
      .add(filler)
      .add(antSvg)

    return this
  }

  // 0 is up
  move(direction = this.direction) {
    // subtract 2 from the direction, because for a honeycomb grid of flat hexes, the 0 direction is "South East"
    this.hex = this.grid.hexes.neighborsOf(this.hex, direction - 2)[0]
    const { x, y } = this.hexToPoint()
    this.svg.move(x, y)

    return this
  }

  turn(delta) {
    this._setDirection(this.direction + delta)
    this.svg
      .select('.ant')
      // .animate({ duration: 490 })
      .rotate(this.direction * 60)

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
