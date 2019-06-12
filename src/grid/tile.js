import { PHEROMONE_EVAPORATE, PHEROMONE_MAX, TILE_SIZE, TILE_TYPES } from '../settings'

export const defineTile = draw => ({
  orientation: 'flat',
  size: TILE_SIZE,
  type: TILE_TYPES.FLOOR,
  pheromone: 0,
  _debugFont: {
    size: TILE_SIZE / 2,
    anchor: 'middle',
    leading: 1.4,
    fill: '#ccc',
  },

  render({ svgSymbol, isNestTile, debug = false } = {}) {
    const { x, y } = this.toPoint()
    const useEl = draw
      .use(svgSymbol)
      .addClass('tile')
      .translate(x, y)

    if (isNestTile) {
      useEl.addClass('tile--nest')
    }

    const groupEl = draw.group().add(useEl)

    if (debug) {
      const position = this.center().add(x, y)
      const coordinatesEl = draw
        .text(`${this.x},${this.y}`)
        // .text(`${this.q},${this.r},${this.s}`)
        .font(this._debugFont)
        .translate(position.x, position.y - this._debugFont.size)
      groupEl.add(coordinatesEl)
    }

    this.svg = groupEl
  },

  tick() {
    if (this.type === TILE_TYPES.NEST) {
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
