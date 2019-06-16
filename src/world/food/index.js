import { FOOD_MAX } from '../../settings'

export class Food {
  constructor({ tile, amount = FOOD_MAX } = {}) {
    this.tile = tile
    this.amount = amount
  }

  render() {
    const { tile } = this
    // todo: this is duplicated in Ant and Grid
    const { x, y } = tile.center().add(tile.toPoint())
    this.svg = tile.svg
      // height is smallest dimension
      .circle(this._svgSize())
      .addClass('food')
      .center(x, y)
    tile.svg.add(this.svg)
  }

  beforeDelete() {
    this.svg.remove()
  }

  consume(amount) {
    this.amount -= Math.min(amount, this.amount)
    this.svg.size(this._svgSize())

    return this.amount
  }

  _svgSize() {
    return this.tile.height() * (this.amount / FOOD_MAX)
  }
}
