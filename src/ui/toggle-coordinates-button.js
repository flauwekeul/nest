import reLiftHTML from 'relift-html'

export const createToggleCoordinatesButton = grid =>
  reLiftHTML({
    tagName: 'toggle-coordinates-button',
    template: '<button type="button" @click="toggle">{this.text}</button>',
    created() {
      this._toggleText()
    },
    toggle() {
      grid.toggleCoordinates()
      this._toggleText()
    },
    _toggleText() {
      this.data.text = grid.isShowingCoordinates ? 'Hide coordinates' : 'Show coordinates'
    },
  })
