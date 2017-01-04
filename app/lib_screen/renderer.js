const fs = require('fs'),
    readdir = require('recursive-readdir'),
    settings = require('electron-settings')
const {dialog} = require('electron').remote
const {ipcRenderer} = require('electron')

let buttonlibrary = document.getElementById('change-lib')
let buttonFile = document.getElementById('open-file')
let buttonOpenSelected = document.getElementById('open-selected')

const MUSIC_XML_FORMATS = ['xml', 'XML']


let selectFileElem = document.getElementById('file-navigator')
let libPath

function loadLib(path){
    libPath = path
    //cleaning element first
    while (selectFileElem.firstChild) {
        selectFileElem.removeChild(selectFileElem.firstChild)
    }
    let countFiles = 0
    readdir(path, [], function (err, files) {
      if(files.length){
        for (let i = files.length - 1; i >= 0; i--) {
            let file = files[i]
            if(MUSIC_XML_FORMATS.indexOf(
                                         file.split('.').pop().toLowerCase()
                                         ) != -1){
              countFiles++
              let option = document.createElement('option')
              option.value = file
              option.textContent = file.split('/').pop()
              option.addEventListener('dbclick', (ev) => {
                openFile(this.value)}
              )
              selectFileElem.appendChild(option)
            }
        }
        if(countFiles>0){
          selectFileElem.size = countFiles
          selectFileElem.disabled = false
          settings.setSync("library", libPath)
        }
        else{
          dialog.showMessageDialog(null, {
            "title":"Tananã - Aviso",
            "message": "Nenhum arquivo encontrado!"
          }) //todo: why isn't this working?
          selectFileElem.disabled = true
        }
      }
    })
}

function openFile(file){
  ipcRenderer.send('open-file', {
    'path': file,
    'libPath': libPath
  })
}

function openSelectedFile(){
    let selectedFiles = selectFileElem.selectedOptions
    if(selectedFiles.length === 0)
      throw new Error("there is no selected file")
    openFile(selectedFiles[0].value)
}

selectFileElem.addEventListener('keyup', (ev) => {
  //if it's the enter key, open the selected file
  if(ev.keyCode === 13) openSelectedFile()
  else return false
})

buttonFile.addEventListener('click', (ev) => {
    file = dialog.showOpenDialog({properties: ['openFile']})[0]
    openFile(file)
})

buttonOpenSelected.addEventListener('click', (ev) => {
    openSelectedFile()
})

buttonlibrary.addEventListener('click', (ev) => {
    libPath = dialog.showOpenDialog({properties: ['openDirectory']})[0]
    loadLib(libPath)
})

ipcRenderer.send('read-lib')

ipcRenderer.on('read-lib-reply', (event, arg) => { loadLib(arg) })
