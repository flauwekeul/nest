import reLiftHTML from 'relift-html'

export const createTickButton = world =>
  reLiftHTML({
    tagName: 'tick-button',
    template: '<button type="button" @click="tick">Tick</button>',
    tick() {
      world.tick()
    },
  })
