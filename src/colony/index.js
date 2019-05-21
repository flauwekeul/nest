import { Ant, Behavior } from "../ant";

export class Colony {
  constructor({ draw, grid } = {}) {
    this.draw = draw
    this.grid = grid
    this.ants = []
  }

  addAnt({ hex = this.grid.hexes[0], direction = 0 } = {}) {
    const { draw, grid } = this
    this.ants.push(new Ant({ draw, grid, hex, direction }))
    return this
  }

  render() {
    this.ants.forEach(ant => {
      ant.render()
    })
    return this
  }

  tick() {
    this.ants.forEach(ant => {
      const behavior = new Behavior({ ant })
      behavior.explore()
    })
    return this
  }
}
