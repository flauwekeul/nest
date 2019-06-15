import { randomNumber } from './utils'

export const TILE_TYPES = {
  FLOOR: 'FLOOR',
  NEST: 'NEST',
}
export const TILE_SIZE = 15

export const TICK_INTERVAL = 200

export const PHEROMONE_MAX = 1000
export const PHEROMONE_EVAPORATE = -1
export const PHEROMONE_DROP = 80

export const FOOD_MAX = 1000

export const WORLD_WIDTH = 50
export const WORLD_HEIGHT = 20
export const WORLD_FOODS = 5
export const WORLD_ANTS = 10
export const WORLD_NEST_COORDINATES = [randomNumber(0, 5), randomNumber(0, 5)]
