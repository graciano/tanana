module.exports = class Player {
  constructor(options){
    this.sheet = options.sheet
    this.bpm = parseFloat(options.bpm)
    this.playing = false
  }

  play() {
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
        if(!cursor.iterator.endReached) {
          execute(cursor)
        }
      })
    }
    execute(this.sheet.cursor)
    this.playing = false
  }

  sleep(beats) {
    let ms = 1000 * beats * (this.bpm / 60)
    ms = parseInt(ms)
    console.log("will sleep "+ms+" ms.")
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
