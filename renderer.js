// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var vexflow = require('vexflow'),
    fs = require('fs'),
    readdir = require('recursive-readdir')
const {dialog} = require('electron').remote

var buttonExample = document.getElementById('open-example')
var buttonlibrary = document.getElementById('button-library')

const MUSIC_XML_FORMATS = ['xml', 'XML']

//todo modularize this spaguetti code

var showMusic = function(path){
    var ulLibrary = document.getElementById('library-view')
    console.log(path)
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


    function StringNote(){
        this.STRING_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F',
                            'F#', 'G', 'G#', 'A', 'A#', 'B']
    }

    StringNote.prototype.getStringFromMidiNumber = function(number){
        var noteWithoutOctave = Math.floor(number % 12)
        var octave = Math.floor(number / 12)
        //TODO make flats appear too
        return this.STRING_NOTES[noteWithoutOctave] + octave
    }

    var vf = new vexflow.Flow.Factory({
      renderer: {selector: 'main-score', width: 500, height: 200}
    })

    var score = vf.EasyScore()
    var system = vf.System()

    system.addStave({
      voices: [
        score.voice(score.notes('C#4/h, C#4'))
      ]
    }).addClef('treble').addTimeSignature('4/4')

    vf.draw()
})

