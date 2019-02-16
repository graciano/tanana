const lengthsFromVoices = voices => voices.reduce((acc, voice) => [
  ...acc,
  ...voice.notes.map(({ length }) => length.realValue)
], [])

const beatsInCursor = cursor => {
  // biggest possible size is the size of the measure itself
  const biggestTime = cursor.iterator.currentMeasure.duration.realValue
  // now get the smallest duration possible to iretate to next element
  return Math.min(
    biggestTime,
    ...lengthsFromVoices(cursor.iterator.currentVoiceEntries)
  )
}

const bpm = sheet => sheet.MusicPartManager.MusicSheet.userStartTempoInBPM

const beatsToMs = (beats, sheet) => 1000 * beats * (bpm(sheet) / 60)

const msToSleep = ({ sheet, cursor }) => {
  const beats = beatsInCursor(cursor)
  const ms = beatsToMs(beats, sheet)
  return parseInt(ms)
}

module.exports = { msToSleep }
