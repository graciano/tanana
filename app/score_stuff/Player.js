const EventEmitter = require('events')

class PlayerEmitter extends EventEmitter {}

module.exports = class Player {
  constructor(options){
    this.sheet = options.sheet
    this.bpm = parseFloat(options.bpm)
    this.playing = false
    this.done = false
    this.playEmitter = new PlayerEmitter()
    this.sheet.cursor.show()
  }

  start() {
    this.playing = true
    let that = this
    let execute = function(cursor) {
      let time = cursor.iterator.currentMeasure.duration.realValue
      that.sleep(time).then( () => {
        cursor.next()
        console.log('note')
        console.log(time)
        console.log(cursor.iterator.currentMeasure)
        console.log('---------end note---------')
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

  play() {
    if (this.done) return false
    this.playing = true
    this.playEmitter.emit('play')
    return true
  }

  pause() {
    if (this.done) return false
    this.playing = false
    return true
  }

  sleep(beats) {
    let ms = 1000 * beats * (this.bpm / 60)
    ms = parseInt(ms)
    console.log("will sleep "+ms+" ms.")
    let that = this
    return new Promise(resolve => {
      that.resolvePlayPromise(resolve, ms)
    })
  }

  toggle(){
    if (this.playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  resolvePlayPromise(resolve, ms) {
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
    if(this.playing) this.play()
  }

}
