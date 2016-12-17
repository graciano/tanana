// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const vexflow = require('vexflow'),
    xmltojson = require('xml2js').Parser(),
    fs = require('fs'),
    readdir = require('recursive-readdir'),
    score_creator = require('./score_stuff/score_creator.js')
const {dialog} = require('electron').remote
const {ipcRenderer} = require('electron')

let buttonExample = document.getElementById('open-example')
let buttonlibrary = document.getElementById('button-library')

const MUSIC_XML_FORMATS = ['xml', 'XML']

//todo modularize this spaguetti code

let showMusic = function(path){
    let ulLibrary = document.getElementById('library-view')
    readdir(path, [], function (err, files) {
      for (let i = files.length - 1; i >= 0; i--) {
          let file = files[i]
          if(MUSIC_XML_FORMATS.indexOf(file.split('.').pop().toLowerCase())!=-1){
            console.log(file)
            let li = document.createElement('li')
            let button = document.createElement('button')
            button.textContent = file.split('/').pop()
            button.classList.add('file')
            // button.addEventListener('click', openFile)
            li.appendChild(button)
            ulLibrary.appendChild(li)
          }
      }
    })
}

buttonlibrary.addEventListener('click', function(){
    libPath = dialog.showOpenDialog({properties: ['openDirectory']})[0]
    showMusic(libPath)
})


buttonExample.addEventListener('click', function(){
    ipcRenderer.send('open-file', 'examples/teste.xml')
    // let musicFile = fs.readFileSync('examples/teste.xml', 'utf-8')
    // xmltojson.parseString(musicFile, function(err, musicjson){
    //     let barWidth = 200
    //     let mediaQueries = []
    //     for(let i=2; i<6; i++) //arbritary whatever
    //         mediaQueries.push({
    //             "query": window.matchMedia("(min-width:"+(i*barWidth)+"px)"),
    //             "bars": i
    //         })
    //     let barsPerLine = 1
    //     //get the maximum bars per line possible
    //     for(let obj of mediaQueries){
    //         if(obj["query"].matches)
    //             barsPerLine = obj["bars"]
    //     }
    //     let options = {
    //         "bars-per-line": barsPerLine,
    //         "bar-width": barWidth
    //     }
    //     score_creator(musicjson, "#main-score", options)
    // })
})

