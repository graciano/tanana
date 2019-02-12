const playerStepRecursive = (player) => {
  const cursor = player.sheet.cursor
  // bigger possible size is the size of the measure itself
  let time = cursor.iterator.currentMeasure.duration.realValue
  // now get the smallest duration possible to iretate to next element
  for (let voice of cursor.iterator.currentVoiceEntries) {
    for (let note of voice.notes) {
      let noteLength = note.length.realValue
      time = time > noteLength ? noteLength : time
    }
  }
  player.sleep(time).then(() => {
    player.playEmitter.emit('next', cursor)
    cursor.next()
    if (cursor.iterator.endReached) {
      player.done = true
      player.playing = false
    } else {
      playerStepRecursive(player)
    }
  })
}

module.exports = playerStepRecursive
