export class Ticker {
  constructor(callback, interval = 1000) {
    this.callback = callback
    this.interval = interval
    this.isTicking = false
    this._intervalId = null
  }

  play() {
    this.isTicking = true
    this._intervalId = setInterval(() => {
      this.callback()
    }, this.interval)
  }

  pause() {
    this.isTicking = false
    window.clearInterval(this._intervalId)
  }

  toggle() {
    this.isTicking ? this.pause() : this.play()
  }
}
