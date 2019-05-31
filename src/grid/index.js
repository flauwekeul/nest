import { defineGrid, extendHex } from 'honeycomb-grid';
import { MAX_PHEROMONE, PHEROMONE_TICK, TILE_TYPES } from '../settings';
import './grid.css';

export class Grid {
  constructor({ draw, width = 1, height = 1, nestHex } = {}) {
    this.draw = draw
    this.nestHex = nestHex

    const Hex = extendHex({
      orientation: 'flat',
      size: 20,
      type: TILE_TYPES.FLOOR,
      nestPheromone: 0,
      foodPheromone: 0,
      // todo: dedupe code
      addNestPheromone(amount = 0) {
        amount += this.nestPheromone
        this.nestPheromone = amount < 1 ? 0 : Math.min(amount, MAX_PHEROMONE)
      },
      addFoodPheromone(amount = 0) {
        amount += this.foodPheromone
        this.foodPheromone = amount < 1 ? 0 : Math.min(amount, MAX_PHEROMONE)
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
        const fontSize = 11
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
    this.hexes.forEach((hex, i) => {
      if (hex.type === TILE_TYPES.NEST || (hex.nestPheromone < 1 && hex.foodPheromone < 1)) {
        return
      }

      hex.svg
        .select('.hex')
        .addClass('hex--pheromone')
        // todo: don't just add pheromones
        .fill({ opacity: (this.hexes[i].nestPheromone + this.hexes[i].foodPheromone) / MAX_PHEROMONE })
      hex.addNestPheromone(PHEROMONE_TICK)
      hex.addFoodPheromone(PHEROMONE_TICK)
    })

    return this
  }
}
