// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var vexflow = require('vexflow'),
    xmltojson = require('xml2js').Parser(),
    fs = require('fs'),
    readdir = require('recursive-readdir'),
    score_creator = require('./score_creator.js')
const {dialog} = require('electron').remote

var buttonExample = document.getElementById('open-example')
var buttonlibrary = document.getElementById('button-library')

const MUSIC_XML_FORMATS = ['xml', 'XML']

//todo modularize this spaguetti code

var showMusic = function(path){
    var ulLibrary = document.getElementById('library-view')
    readdir(path, [], function (err, files) {
      for (var i = files.length - 1; i >= 0; i--) {
          var file = files[i]
          if(MUSIC_XML_FORMATS.indexOf(file.split('.').pop().toLowerCase())!=-1){
            console.log(file)
            var li = document.createElement('li')
            var button = document.createElement('button')
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
    var musicFile = fs.readFileSync('exemplos/teste.xml', 'utf-8')
    xmltojson.parseString(musicFile, function(err, musicjson){
        score_creator(musicjson)
    })
})

