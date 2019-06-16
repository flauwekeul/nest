import { PHEROMONE_EVAPORATE, PHEROMONE_MAX, TILE_SIZE, TILE_TYPES } from '../../settings'
import './tile.css'

const _debugFont = {
  size: TILE_SIZE / 2,
  anchor: 'middle',
  leading: 1.4,
  fill: '#ccc',
}

export const defineTile = draw => ({
  orientation: 'flat',
  size: TILE_SIZE,
  type: TILE_TYPES.FLOOR,
  pheromone: 0,

  render({ svgSymbol } = {}) {
    const { x, y } = this.toPoint()
    const useEl = draw
      .use(svgSymbol)
      .addClass('tile')
      .translate(x, y)

    if (this.isNest()) {
      useEl.addClass('tile--nest')
    }

    this.svg = draw.group().add(useEl)
  },

  toggleCoordinates() {
    const coordinates = this.svg.select('.tile--coordinates').first()

    if (coordinates) {
      return coordinates.visible() ? coordinates.hide() : coordinates.show()
    }

    const { x, y } = this.toPoint()
    const position = this.center().add(x, y)
    const coordinatesEl = this.svg
      .text(`${this.x},${this.y}`)
      // .text(`${this.q},${this.r},${this.s}`)
      .addClass('tile--coordinates')
      .font(_debugFont)
      .translate(position.x, position.y - _debugFont.size)
    this.svg.add(coordinatesEl)
  },

  isNest() {
    return this.type === TILE_TYPES.NEST
  },

  isFloor() {
    return this.type === TILE_TYPES.FLOOR
  },

  tick() {
    if (this.isNest()) {
      return
    }

    if (this.pheromone > 0) {
      this._renderPheromone()
      this.addPheromone(PHEROMONE_EVAPORATE)
    }

    if (this.food && this.food.amount < 1) {
      this.food.beforeDelete()
      delete this.food
    }
  },

  // todo: use Pheromone class and move managing of its instances to World (just like Food)
  addPheromone(amount = 0) {
    amount += this.pheromone
    this.pheromone = amount < 1 ? 0 : Math.min(amount, PHEROMONE_MAX)
    this._renderPheromone()
  },

  _renderPheromone() {
    this.svg
      .select('.tile')
      .addClass('tile--pheromone')
      .fill({ opacity: this.pheromone / PHEROMONE_MAX })
  },
})
