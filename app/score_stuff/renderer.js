const { OpenSheetMusicDisplay } = require('opensheetmusicdisplay')
const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const Player = require('./Player.js')

let libPath
let player
ipcRenderer.send('read-file')
ipcRenderer.send('back-to-lib-window')

ipcRenderer.on('back-to-lib-window-reply', (event, arg) => {
  libPath = arg
})

ipcRenderer.on('read-file-reply', (event, { fileData }) => {
  try {
    // render music sheet
    const scoreElem = document.querySelector('#main-score')
    const osmd = new OpenSheetMusicDisplay(scoreElem)
    osmd.load(fileData, true)
    osmd.render()

    // removing loading warning
    document.querySelector('h1').remove()

    // updating player and adding it's listeners on buttons
    player = new Player({ osmd })
    console.log(player)
    player.start()

    document.addEventListener('keyup', ev => {
      // space bar
      if (ev.keyCode === 32) {
        player.toggle()
      }
      return false
    })

    // preventing spacebar from scrolling
    document.addEventListener('keydown', ev => {
      if (ev.keyCode === 32) {
        ev.preventDefault()
      }
    })
  } catch (err) {
    console.log(err)
    dialog.showErrorBox('Tananã - erro', err.message)
  }
  // TODO get title from osmd
  let title = false
  title = title ? title + ' | Tananã' : 'Tananã | Música Desconhecida'
  document.title = title
})

const backButton = document.querySelector('#back-button')

function goBack () {
  if (libPath) ipcRenderer.send('open-lib', libPath)
  else ipcRenderer.send('open-main-window')
}

backButton.addEventListener('click', goBack)

window.addEventListener('keyup', (ev) => {
  // escape key
  if (ev.keyCode === 27) goBack()
  else return false
})

let playerStarted = false
// this still can have some concurrence problems. todo fix later
function togglePlay () {
  if (playerStarted) {
    player.toggle()
  } else {
    playerStarted = true
    player.start()
  }
}

let playButton = document.querySelector('#play-button')
playButton.addEventListener('click', togglePlay)

// preventing spacebar from scrolling
document.addEventListener('keydown', ev => {
  if (ev.keyCode === 32) {
    ev.preventDefault()
  }
})

document.addEventListener('keyup', ev => {
  // space bar
  if (ev.keyCode === 32) {
    togglePlay()
  }
  return false
})
