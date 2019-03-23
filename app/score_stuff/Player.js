const { msToSleep } = require('./osmdUtils')

const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = class Player {
  constructor ({ osmd }) {
    this.osmd = osmd
    this.started = false
    this.playing = false
    this.done = false
  }

  start () {
    this.osmd.cursor.show()
    this.started = true
    this.play()
  }

  play () {
    if (!this.started) return this.start()
    if (this.done) return
    this.playing = true
    this.stepRecursive()
  }

  pause () {
    if (this.done) return
    this.playing = false
  }

  toggle () {
    if (this.playing) this.pause()
    else this.play()
  }

  end () {
    this.done = true
    this.playing = false
    this.osmd.cursor.reset()
    this.osmd.cursor.hide()
  }

  async stepRecursive () {
    const { cursor } = this.osmd
    console.log(`awaiting ${msToSleep(this.osmd)} ms`)
    console.log(this.osmd)
    await sleep(msToSleep(this.osmd))
    if (this.playing) {
      cursor.next()
      if (cursor.iterator.endReached) this.end()
      else await this.stepRecursive()
    }
  }
}
