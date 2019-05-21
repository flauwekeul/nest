export class Behavior {
  constructor({ ant }) {
    this.ant = ant
    this.lastTurnDirection = Math.random() < 0.5 ? -1 : 1
  }

  explore() {
    // 10% to do nothing
    if (Math.random() < 0.1) {
      return
    }

    const hexInFront = this.ant.hexInFront()
    // when the ant can move forward: 90% it will, 10% it'll turn
    if (hexInFront && Math.random() > 0.1) {
      this.ant.move()
    } else {
      // 80% chance to turn the same direction as last time
      this.lastTurnDirection *= Math.random() > 0.2 ? 1 : -1
      this.ant.turn(this.lastTurnDirection)
    }
  }
}
