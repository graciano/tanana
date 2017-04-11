const EventEmitter = require('events')

class PlayerEmitter extends EventEmitter {}

module.exports = class Player {
  constructor (options) {
    options = options || {}
    this.sheet = options.sheet
    this.bpm = parseFloat(options.bpm)
    this.playing = false
    this.done = false
    this.playEmitter = new PlayerEmitter()
    this.sheet.cursor.show()
  }

  start () {
    this.playing = true
    let that = this
    // todo refactor this function in other file
    let execute = function (cursor) {
      // bigger possible size is the size of the measure itself
      let time = cursor.iterator.currentMeasure.duration.realValue
      // now get the smallest duration possible to iretate to next element
      for (let voice of cursor.iterator.currentVoiceEntries) {
        for (let note of voice.notes) {
          let noteLenght = note.length.realValue
          time = time > noteLenght ? noteLenght : time
        }
      }
      that.sleep(time).then(() => {
        this.playEmitter.emit('next', this.cursor)
        cursor.next()
        if (cursor.iterator.endReached) {
          that.done = true
          that.playing = false
        } else {
          execute(cursor)
        }
      })
    }
    execute(this.sheet.cursor)
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
