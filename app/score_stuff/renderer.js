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
    let musicjson = arg
    let barWidth = 200
    let mediaQueries = []
    let bleed = 60

    for(let i=2; i<6; i++) //arbritary number hard coded whatever
        mediaQueries.push({
            "query": window.matchMedia("(min-width:"
                                       +((i*barWidth) + bleed)+"px)"),
            "bars": i
        })
    let barsPerLine = 1
    //get the maximum bars per line possible
    for(let obj of mediaQueries){
        if(obj["query"].matches)
            barsPerLine = obj["bars"]
    }
    let options = {
        "bars-per-line": barsPerLine,
        "bar-width": barWidth
    }
    try{
        score_creator(musicjson, "#main-score", options)
    }catch(err){
        console.log(err)
        dialog.showErrorBox('Tananã - erro', err.message)
    }
    let title = checkNested(musicjson,
            "score-partwise", "work", 0, "work-title", 0)
    title = title? title : "Música Desconhecida"
    document.querySelector("h1").textContent = title
    document.title = title + " | Tananã"
})

let backButton = document.querySelector("#back-button")

backButton.addEventListener('click', function(){
    if(libPath) ipcRenderer.send('open-lib', libPath)
    else ipcRenderer.send('open-main-window')
})