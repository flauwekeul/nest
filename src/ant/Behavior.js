export class Behavior {
  constructor({ ant }) {
    this.ant = ant
  }

  explore() {
    // this.ant.turn(Math.random() < 0.5 ? -1 : 1)
    this.ant.turn(1)
    this.ant.move()
  }
}
