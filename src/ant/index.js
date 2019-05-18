export default class Ant {
  constructor({ grid }) {
    this.grid = grid
  }

  render({ draw, hex }) {
    this.hex = hex
    const { x, y } = this.hexToPoint()
    this.svg = draw.use('ant')
      .fill('#333')
      .size(32)
      .center(x, y)
    return this
  }

  // 0 is SE
  move(direction = 0) {
    this.hex = this.grid.hexes.neighborsOf(this.hex, direction)[0]
    const { x, y } = this.hexToPoint()
    this.svg.center(x, y)
    return this
  }

  // 0 is up
  rotate(direction = 0) {
    this.svg.rotate(direction * 60)
    return this
  }

  hexToPoint() {
    return this.hex.center().add(this.hex.toPoint())
  }
}
