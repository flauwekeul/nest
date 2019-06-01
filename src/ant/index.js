import { PHEROMONE_DROP, TICK_INTERVAL } from '../settings';
import { randomNumber, signedModulo } from '../utils';
import './ant.css';

// a little shorter than the tick interval to make sure the animation always finishes before the next tick
const animationDuration = TICK_INTERVAL - 10

export class Ant {
  constructor({
    draw,
    tile,
    direction = 0,
    surroundingTiles = () => [],
    tileTowardsNest = () => { },
  } = {}) {
    this.draw = draw
    this.tile = tile
    this._setDirection(direction)
    this.surroundingTiles = surroundingTiles
    this.tileTowardsNest = tileTowardsNest
    this._currentActivity = () => this.explore()
  }

  render() {
    const { x, y } = this._tileToPoint()
    const antSvg = this.draw.use('ant')
      .addClass('ant')
      .size(40)
      .center(0, 0)
      // add 2 to direction to make it point the same way as a (flat) honeycomb hex
      .rotate((this.direction + 2) * 60)
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

  tick() {
    this._currentActivity()
    return this
  }

  move(tile) {
    this.tile = tile
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

  turnTowards(tile) {
    if (tile.equals(this._tileInFront())) {
      return this
    }

    const { q, r, s } = tile
    const turnDirectionMap = {
      0: r - this.tile.r,
      1: this.tile.q - q,
      2: s - this.tile.s,
      3: this.tile.r - r,
      4: q - this.tile.q,
      5: this.tile.s - s
    }
    const turnDirection = turnDirectionMap[this.direction] || this._randomDirection()
    this.turn(turnDirection)

    return this
  }

  take(contents) {
    // todo: take chunk of food
    this.carrying = contents
    this.svg
      .select('.ant')
      // todo: add something in jaws of ant to show it's carrying something
      .addClass('ant--carrying')
    this._currentActivity = () => this.returnToNest()

    return this
  }

  drop() {
    // todo: do something with dropped food
    this.carrying = null
    this.svg
      .select('.ant')
      .removeClass('ant--carrying')
    this._currentActivity = () => this.goToFood()

    return this
  }

  // BEHAVIORS

  explore() {
    // console.clear()
    // 10% chance to do nothing
    // todo: use this to "sense" multiple tiles?
    if (Math.random() < 0.1) {
      return this
    }

    const tileInFront = this._tileInFront()
    if (tileInFront && tileInFront.food) {
      return this.take()
    }

    const tilesInFront = this._tilesInFront()
    const { length } = tilesInFront

    if (length === 0) {
      return this.turn(this._randomDirection())
    }

    let priorityTile
    if (length === 1) {
      priorityTile = tilesInFront[0]
      // console.log('single tile in front', priorityTile);
    } else if (!tilesInFront.some(({ food, pheromone }) => food || pheromone > 0)) {
      priorityTile = tileInFront && Math.random() > 0.3
        ? tileInFront
        : tilesInFront[randomNumber(0, length - 1)]
      // console.log('nothing special', priorityTile);
    } else {
      // fixme: find a way for ants to go the right direction on the trail (they often go towards the nest)
      priorityTile = tilesInFront.sort((a, b) => a.food ? -1 : b.food ? 1 : b.pheromone - a.pheromone)[0]
      // console.log('oh yeah', tilesInFront, priorityTile);
    }

    if (priorityTile.equals(tileInFront)) {
      return this.move(priorityTile)
    }

    return this.turnTowards(priorityTile)
  }

  returnToNest() {
    // fixme: randomly go different direction to make it less perfect
    const tileInFront = this._tileInFront()
    // fixme: when there's already a trail, follow it instead of using tileTowardsNest
    const tileTowardsNest = this.tileTowardsNest(this.tile)

    if (!tileTowardsNest) {
      return this.drop()
    }

    if (tileInFront && tileTowardsNest.equals(tileInFront)) {
      this.tile.addPheromone(PHEROMONE_DROP)
      return this.move(tileInFront)
    }

    this.turnTowards(tileTowardsNest)
  }

  goToFood() {
    // fixme: implement
  }

  // PRIVATES

  _tileToPoint() {
    return this.tile.center().add(this.tile.toPoint())
  }

  _setDirection(direction = 0) {
    this.direction = signedModulo(direction, 6)
  }

  _randomDirection() {
    return Math.random() > 0.5 ? 1 : -1
  }

  _tileInFront() {
    return this.surroundingTiles(this.tile, this.direction)[0]
  }

  _tilesInFront() {
    const { direction } = this
    return this.surroundingTiles(this.tile, [direction - 1, direction, direction + 1])
  }
}
