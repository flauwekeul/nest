import { defineGrid, extendHex } from 'honeycomb-grid';
import { PHEROMONE_EVAPORATE, PHEROMONE_MAX, TILE_TYPES } from '../settings';
import './grid.css';

export class Grid {
  constructor({ draw, width = 1, height = 1, nestHex } = {}) {
    this.draw = draw
    this.nestHex = nestHex

    // todo: use Tile class?
    const Hex = extendHex({
      orientation: 'flat',
      size: 20,
      type: TILE_TYPES.FLOOR,
      pheromone: 0,
      addPheromone(amount = 0) {
        amount += this.pheromone
        this.pheromone = amount < 1 ? 0 : Math.min(amount, PHEROMONE_MAX)
      }
    })
    const Grid = defineGrid(Hex)
    this.hexes = Grid.rectangle({ width, height })

    // todo: honeycomb: corners should be on Hex?
    const hexCorners = this.hexes[0].corners()
    this.hexSymbol = draw.symbol().polygon(hexCorners.map(({ x, y }) => `${x},${y}`))
  }

  render({ debug = false } = {}) {
    this.hexes.forEach(hex => {
      const { x, y } = hex.toPoint()
      const useEl = this.draw
        .use(this.hexSymbol)
        .addClass('hex')
        .translate(x, y)

      if (hex.equals(this.nestHex)) {
        useEl.addClass('hex--nest')
      }

      const groupEl = this.draw.group().add(useEl)

      if (debug) {
        const fontSize = 10
        const position = hex.center().add(x, y)
        const coordinatesEl = this.draw
          .text(`${hex.x},${hex.y}`)
          // .text(`${hex.q},${hex.r},${hex.s}`)
          .font({
            size: fontSize,
            anchor: 'middle',
            leading: 1.4,
            fill: '#ccc'
          })
          .translate(position.x, position.y - fontSize)
        groupEl.add(coordinatesEl)
      }

      hex.svg = groupEl
    })

    return this
  }

  tick() {
    // fixme: use Pheromone class and keep Grid only responsible for hexes, not pheromones or food
    this.hexes.forEach((hex, i) => {
      if (hex.food && hex.food.amount < 1) {
        // todo: use Proxy to automatically call beforeDelete()?
        hex.food.beforeDelete()
        delete hex.food
      }

      if (hex.type === TILE_TYPES.NEST || hex.pheromone < 1) {
        return
      }

      hex.svg
        .select('.hex')
        .addClass('hex--pheromone')
        .fill({ opacity: this.hexes[i].pheromone / PHEROMONE_MAX })
      hex.addPheromone(PHEROMONE_EVAPORATE)
    })

    return this
  }
}
