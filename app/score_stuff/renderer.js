let OSMD = require('opensheetmusicdisplay').OSMD
let Player = require('./Player.js')
const {ipcRenderer} = require('electron')
const {dialog} = require('electron').remote

let libPath
ipcRenderer.send('read-file')
ipcRenderer.send('back-to-lib-window')

ipcRenderer.on('back-to-lib-window-reply', (event, arg) => {
  libPath = arg
})

ipcRenderer.on('read-file-reply', (event, arg) => {
  let fileData = arg['fileData']

  try {
    // render music sheet
    let scoreElem = document.querySelector('#main-score')
    let sheet = new OSMD(scoreElem)
    sheet.load(fileData, true)
    sheet.render()

    // removing loading warning
    document.querySelector('h1').remove()

    // creating player and adding it's listeners on buttons
    let player = new Player({
      'sheet': sheet
    })
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

let backButton = document.querySelector('#back-button')

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
