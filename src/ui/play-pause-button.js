import reLiftHTML from 'relift-html'

export const createPlayPauseButton = ticker =>
  reLiftHTML({
    tagName: 'play-pause-button',
    template: '<button type="button" @click="toggle">{this.text}</button>',
    data: {
      text: ticker.isTicking ? 'Pause' : 'Play',
      disabled: false,
    },
    toggle() {
      ticker.isTicking ? this.pause() : this.play()
    },
    play() {
      this.data.text = 'Pause'
      this.el.setAttribute('disabled', true)
      ticker.play()
    },
    pause() {
      this.data.text = 'Play'
      this.el.removeAttribute('disabled')
      ticker.pause()
    },
  })
