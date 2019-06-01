import { MAX_PHEROMONE, PHEROMONE_DROP, TICK_INTERVAL, TILE_TYPES } from '../settings';
import { signedModulo } from '../utils';
import './ant.css';

// a little shorter than the tick interval to make sure the animation always finishes before the next tick
const animationDuration = TICK_INTERVAL - 10

export class Ant {
  constructor({
    draw,
    tile,
    direction = 0,
    surroundingTiles = () => { },
    tileTowardsNest = () => { },
  } = {}) {
    this.draw = draw
    this.tile = tile
    this._setDirection(direction)
    this.surroundingTiles = surroundingTiles
    this.tileTowardsNest = tileTowardsNest
    // todo: lastTurnDirection isn't used right
    this.lastTurnDirection = Math.random() < 0.5 ? -1 : 1
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
    const turnDirection = turnDirectionMap[this.direction] || this.lastTurnDirection
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
    this._currentActivity = () => this.returnToFood()

    return this
  }

  // BEHAVIORS

  explore() {
    // 10% chance to do nothing
    if (Math.random() < 0.1) {
      return this
    }

    const [leftTile, frontTile, rightTile] = this._tilesInFront()

    if (frontTile && frontTile.food) {
      return this._currentActivity = () => this.take()
    }

    const priorityTile = [frontTile, leftTile, rightTile].find(tile =>
      tile && (tile.food || tile.foodPheromone > 0 || tile.nestPheromone < MAX_PHEROMONE * 0.1)
    )
    if (Math.random() > 0.8 || !priorityTile || !frontTile) {
      this.lastTurnDirection *= Math.random() > 0.2 ? 1 : -1
      return this.turn(this.lastTurnDirection)
    }

    if (priorityTile.equals(frontTile) || Math.random() > 0.2) {
      this.tile.addNestPheromone(PHEROMONE_DROP)
      return this.move(frontTile)
    }

    return this.turnTowards(priorityTile)
  }

  returnToNest() {
    const [leftTile, frontTile, rightTile] = this._tilesInFront()

    if (frontTile && frontTile.type === TILE_TYPES.NEST) {
      return this.drop()
    }

    const priorityTile = [frontTile, leftTile, rightTile]
      .filter(Boolean)
      .sort((a, b) => b.nestPheromone - a.nestPheromone)[0]
    if (!priorityTile || !frontTile) {
      this.lastTurnDirection *= Math.random() > 0.2 ? 1 : -1
      return this.turn(this.lastTurnDirection)
    }

    if (priorityTile.equals(frontTile)) {
      this.tile.addFoodPheromone(PHEROMONE_DROP)
      return this.move(frontTile)
    } else {
      return this.turnTowards(priorityTile)
    }
  }

  returnToFood() {
    // todo: implement
  }

  // PRIVATES

  _tileToPoint() {
    return this.tile.center().add(this.tile.toPoint())
  }

  _setDirection(direction = 0) {
    this.direction = signedModulo(direction, 6)
  }

  _tileInFront() {
    return this.surroundingTiles(this.tile, this.direction)[0]
  }

  _tilesInFront() {
    const { direction } = this
    return this.surroundingTiles(this.tile, [direction - 1, direction, direction + 1])
  }
}
