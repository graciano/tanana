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

function loadLib (path) {
  libPath = path
  // cleaning element first
  while (selectFileElem.firstChild) {
    selectFileElem.removeChild(selectFileElem.firstChild)
  }
  let countFiles = 0
  readdir(path, [], function (err, files) {
    if (err) {
      console.log(err)
      dialog.showErrorBox('Tananã - erro', err.message)
    }
    if (files.length) {
      for (let i = files.length - 1; i >= 0; i--) {
        let file = files[i]
        let fileFormat = file.split('.').pop().toLowerCase()
        if (MUSIC_XML_FORMATS.indexOf(fileFormat) !== -1) {
          countFiles++
          let option = document.createElement('option')
          option.value = file
          option.textContent = file.split('/').pop()
          option.addEventListener('dblclick', (ev) => {
            openFile(option.value)
          })
          selectFileElem.appendChild(option)
        }
      }
      if (countFiles > 0) {
        selectFileElem.size = countFiles
        selectFileElem.disabled = false
        settings.setSync('library', libPath)
      } else {
        dialog.showMessageBox({
          'title': 'Tananã - Aviso',
          'message': 'Nenhum arquivo encontrado!'
        })
        selectFileElem.disabled = true
      }
    }
  })
}

function openFile (file) {
  ipcRenderer.send('open-file', {
    'path': file,
    'libPath': libPath
  })
}

function openSelectedFile () {
  let selectedFiles = selectFileElem.selectedOptions
  if (selectedFiles.length === 0) {
    dialog.showMessageBox({
      'title': 'Tananã - Aviso',
      'message': 'Nenhum arquivo foi selecionado!'
    })
  } else openFile(selectedFiles[0].value)
}

selectFileElem.addEventListener('keyup', (ev) => {
  // if it's the enter key, open the selected file
  if (ev.keyCode === 13) openSelectedFile()
  else return false
})

buttonFile.addEventListener('click', (ev) => {
  const file = dialog.showOpenDialog({ properties: ['openFile'] })[0]
  openFile(file)
})

buttonOpenSelected.addEventListener('click', openSelectedFile)

buttonlibrary.addEventListener('click', (ev) => {
  const libPath = dialog.showOpenDialog({ properties: ['openDirectory'] })[0]
  loadLib(libPath)
})

ipcRenderer.send('read-lib')

ipcRenderer.on('read-lib-reply', (event, arg) => { loadLib(arg) })
