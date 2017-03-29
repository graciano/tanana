const score_creator = require('./score_creator.js')
const {electron} = require('electron')
const {ipcRenderer} = require('electron')
const checkNested = require('./../util/check-nested.js')
const {dialog} = require('electron').remote

let libPath
ipcRenderer.send('read-file')
ipcRenderer.send('back-to-lib-window')


ipcRenderer.on('back-to-lib-window-reply', (event, arg) => {
    libPath = arg
})

ipcRenderer.on('read-file-reply', (event, arg) => {
    let fileData = arg.fileData

    try{
      let scoreElem = document.querySelector("#main-score")
      let osmd = new OSMD(scoreElem, true)
      osmd.load(fileData)
      osmd.render()
    }catch(err){
        console.log(err)
        dialog.showErrorBox('Tananã - erro', err.message)
    }
    //TODO get title from osmd
    let title = null
    title = title? title : "Música Desconhecida"
    document.querySelector("h1").remove()
    document.title = title + " | Tananã"
})

let backButton = document.querySelector("#back-button")

function goBack(){
    if(libPath) ipcRenderer.send('open-lib', libPath)
    else ipcRenderer.send('open-main-window')
}

backButton.addEventListener('click', goBack)
window.addEventListener('keyup', (ev) => {
    if(ev.keyCode === 27) // escape key
        goBack()
    else return false
})
