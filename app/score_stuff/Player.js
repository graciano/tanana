const EventEmitter = require('events')
const playerStepRecursive = require('./playerStepRecursive')

class PlayerEmitter extends EventEmitter {}

module.exports = class Player {
  constructor (options) {
    options = options || {}
    this.sheet = options.sheet
    this.bpm = this.sheet.sheet.MusicPartManager.MusicSheet.userStartTempoInBPM
    this.playing = false
    this.done = false
    this.playEmitter = new PlayerEmitter()
    this.sheet.cursor.show()
  }

  start () {
    this.playing = true
    playerStepRecursive(this)
  }

  play () {
    if (this.done) return false
    this.playing = true
    this.playEmitter.emit('play')
    return true
  }

  pause () {
    if (this.done) return false
    this.playing = false
    return true
  }

  sleep (beats) {
    let ms = 1000 * beats * (this.bpm / 60)
    ms = parseInt(ms)
    let that = this
    return new Promise(resolve => {
      that.resolvePlayPromise(resolve, ms)
    })
  }

  toggle () {
    if (this.playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  resolvePlayPromise (resolve, ms) {
    let that = this
    let play = () => {
      setTimeout(() => {
        if (that.playing) {
          that.playEmitter.removeListener('play', play)
          resolve()
        }
      }, ms)
    }
    this.playEmitter.on('play', play)
    if (this.playing) this.play()
  }

  listenCursor (callback) {
    this.playEmitter.on('next', callback)
  }
}
