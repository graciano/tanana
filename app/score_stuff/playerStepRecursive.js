const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))

const playerStepRecursive = async (player) => {
  const { cursor } = player.osmd
  await sleep(player.msToSleep())
  if (player.playing) cursor.next()
  if (cursor.iterator.endReached) {
    player.done = true
    player.playing = false
  } else {
    await playerStepRecursive(player)
  }
}

module.exports = playerStepRecursive
