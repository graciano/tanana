const readdir = require('recursive-readdir')
const settings = require('electron-settings')
const { dialog } = require('electron').remote
const { ipcRenderer } = require('electron')

const buttonlibrary = document.getElementById('change-lib')
const buttonFile = document.getElementById('open-file')
const buttonOpenSelected = document.getElementById('open-selected')

const MUSIC_XML_FORMATS = ['xml', 'XML']

const selectFileElem = document.getElementById('file-navigator')
let libPath

const fileFormat = file => file.split('.').pop().toLowerCase()

const cleanFilesFromList = () => {
  while (selectFileElem.firstChild) {
    selectFileElem.removeChild(selectFileElem.firstChild)
  }
}

const addFileToList = file => {
  const option = document.createElement('option')
  option.value = file
  option.textContent = file.split('/').pop()
  option.addEventListener('dblclick', (ev) => {
    openFile(option.value)
  })
  selectFileElem.appendChild(option)
}

const loadLib = async path => {
  try {
    const files = (await readdir(path))
      .filter(file => MUSIC_XML_FORMATS.indexOf(fileFormat(file)) !== -1)
    libPath = path
    cleanFilesFromList()
    files.forEach(addFileToList)
    if (files.length > 0) {
      selectFileElem.size = files.length
      selectFileElem.disabled = false
      settings.setSync('library', libPath)
    } else {
      dialog.showMessageBox({
        'title': 'Tananã - Aviso',
        'message': 'Nenhum arquivo encontrado!'
      })
      selectFileElem.disabled = true
    }
  } catch (err) {
    console.log(err)
    dialog.showErrorBox('Tananã - erro', err.message)
  }
}

const openFile = path => ipcRenderer.send('open-file', {
  path,
  libPath
})

const openSelectedFile = () => {
  const { selectedOptions } = selectFileElem
  if (selectedOptions.length === 0) {
    dialog.showMessageBox({
      'title': 'Tananã - Aviso',
      'message': 'Nenhum arquivo foi selecionado!'
    })
  } else openFile(selectedOptions.pop().value)
}

selectFileElem.addEventListener('keyup', ({ keyCode }) => {
  // if it's the enter key, open the selected file
  if (keyCode === 13) openSelectedFile()
})

buttonFile.addEventListener('click', () => {
  const file = dialog.showOpenDialog({ properties: ['openFile'] }).pop()
  openFile(file)
})

buttonOpenSelected.addEventListener('click', openSelectedFile)

buttonlibrary.addEventListener('click', (ev) => {
  const libPath = dialog.showOpenDialog({ properties: ['openDirectory'] }).pop()
  loadLib(libPath)
})

ipcRenderer.send('read-lib')

ipcRenderer.on('read-lib-reply', (event, arg) => { loadLib(arg) })
