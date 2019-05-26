import { SETTINGS } from '../settings';
import { signedModulo } from '../utils';

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
  }

  render() {
    // todo: create antSymbol once and use it for each ant
    const { x, y } = this.tileToPoint()
    const antSvg = this.draw.use('ant')
      .addClass('ant')
      .fill('#333')
      .size(40)
      .center(0, 0)
      .rotate(this.direction * 60)
    // create a filler rectangle to make the group occupy the same space as a tile
    const filler = this.draw
      .rect(this.tile.width(), this.tile.height())
      .fill('none')
      .center(0, 0)
    this.svg = this.draw
      .group()
      .center(x, y)
      .add(filler)
      .add(antSvg)

    return this
  }

  tileInFront() {
    // subtract 2 from the direction, because for a honeycomb grid of flat hexes, the 0 direction is "South East"
    return this.surroundingTiles({ tile: this.tile, direction: this.direction - 2 })[0]
  }

  // todo: also move to tile to the left and right of the tile in front?
  move() {
    this.tile = this.tileInFront()
    const { x, y } = this.tileToPoint()
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

  tileToPoint() {
    return this.tile.center().add(this.tile.toPoint())
  }

  _setDirection(direction = 0) {
    this.direction = signedModulo(direction, 6)
  }
}
