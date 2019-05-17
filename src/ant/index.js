export default class Ant {
  constructor({ hex }) {
    this.hex = hex
  }

  render({ draw }) {
    const { x, y } = this.hex.center().add(this.hex.toPoint())
    this.svg = draw.use('ant')
      .fill('#333')
      .size(32)
      .center(x, y)

    return this
  }
}
