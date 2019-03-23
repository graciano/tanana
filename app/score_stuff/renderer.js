const { OpenSheetMusicDisplay } = require('opensheetmusicdisplay')
const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const Player = require('./Player.js')

let libPath
ipcRenderer.send('read-file')
ipcRenderer.send('back-to-lib-window')

ipcRenderer.on('back-to-lib-window-reply', (event, arg) => (libPath = arg))

const renderSheet = async fileData => {
  const scoreElem = document.querySelector('#main-score')
  const osmd = new OpenSheetMusicDisplay(scoreElem)
  await osmd.load(fileData, true)
  // removing loading warning
  document.querySelectorAll('.loading').forEach(e => e.remove())
  osmd.render()
  console.log('osmd', osmd)
  return new Player({ osmd })
}

const spacebarToggle = player => document.addEventListener('keyup', ev => {
  // space bar
  if (ev.keyCode === 32) {
    ev.preventDefault()
    player.toggle()
  }
  return false
})

const toggleButton = player => document.querySelector('#play-button')
  .addEventListener('click', () => player.toggle())
const stopButton = player => document.querySelector('#stop-button')
  .addEventListener('click', () => player.end())

ipcRenderer.on('read-file-reply', async (event, { fileData }) => {
  try {
    const player = await renderSheet(fileData)
    spacebarToggle(player)
    toggleButton(player)
    stopButton(player)
  } catch (err) {
    console.log(err)
    dialog.showErrorBox('Tananã - erro', err.message)
  }
  // TODO get title from osmd
  let title = false
  title = title ? title + ' | Tananã' : 'Tananã | Música Desconhecida'
  document.title = title
})

const goBack = () => {
  if (libPath) ipcRenderer.send('open-lib', libPath)
  else ipcRenderer.send('open-main-window')
}

document.querySelector('#back-button').addEventListener('click', goBack)

document.addEventListener('keyup', (ev) => {
  // escape key
  if (ev.keyCode === 27) goBack()
  else return false
})
