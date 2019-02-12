const { dialog } = require('electron').remote
const { ipcRenderer } = require('electron')

const buttonExample = document.getElementById('open-example')
const buttonlibrary = document.getElementById('button-library')

buttonlibrary.addEventListener('click', () => {
  const libPath = dialog.showOpenDialog({ properties: ['openDirectory'] }).pop()
  ipcRenderer.send('open-lib', libPath)
})

buttonExample.addEventListener('click', () => ipcRenderer
  .send('open-file', { path: 'examples/teste.xml' }))
