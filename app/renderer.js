// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs'),
    readdir = require('recursive-readdir'),
    score_creator = require('./score_stuff/score_creator.js')
const {dialog} = require('electron').remote
const {ipcRenderer} = require('electron')

let buttonExample = document.getElementById('open-example')
let buttonlibrary = document.getElementById('button-library')

buttonlibrary.addEventListener('click', function(){
    libPath = dialog.showOpenDialog({properties: ['openDirectory']})[0]
    ipcRenderer.send('open-lib', libPath)
})


buttonExample.addEventListener('click', function(){
    ipcRenderer.send('open-file', {path:'examples/teste.xml'})
})

