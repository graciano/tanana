class Player {
  constructor(options){
    this.sheet = options.sheet
    this.bpm = options.bpm
    this.playing = false
  }

  play() {
    this.playing = true
    let that = this
    let execute = function(cursor) {
      let time = cursor.iterator.currentTimeStamp.realValue
      console.log(time)
      that.sleep(time).then( () => {
        let note = cursor.next()
        console.log(note)
        if(note) {
          execute(cursor)
        }
      })
    }
    execute(this.sheet.cursor)
    this.playing = false
  }

  sleep(beats) {
    let ms = 1000 * beats * (this.bpm / 60)
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = Player
