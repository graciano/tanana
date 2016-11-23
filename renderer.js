// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


var MIDIFile = require('midifile', 'src'),
    MIDIFileHeader = require('midifile', 'src', 'MIDIFileHeader'),
// var MIDIFile = require('../MIDIFile/dist/MIDIFile.js'),
//     MIDIFileHeader = require('../MIDIFile/dist/MIDIFile.js', 'MIDIFileHeader'),
    MIDIEvents = require('midievents'),
    fs = require('fs'),
    readdir = require('recursive-readdir')
const {dialog} = require('electron').remote

var buttonExemplo = document.getElementById('abrir-exemplo')
var buttonBiblioteca = document.getElementById('button-biblioteca')

const MIDI_FORMATS = ['mid', 'midi']


var showMusic = function(path){
    var ulBilioteca = document.getElementById('biblioteca-view')
    console.log(path)
    readdir(path, [], function (err, files) {
      for (var i = files.length - 1; i >= 0; i--) {
          var file = files[i]
          if(MIDI_FORMATS.indexOf(file.split('.').pop().toLowerCase())!=-1){
            console.log(file)
            var li = document.createElement('li')
            var button = document.createElement('button')
            button.textContent = file.split('/').pop()
            button.classList.add('file')
            // button.addEventListener('click', openFile)
            li.appendChild(button)
            ulBilioteca.appendChild(li)
          }
      }
    })
}

buttonBiblioteca.addEventListener('click', function(){
    libPath = dialog.showOpenDialog({properties: ['openDirectory']})[0]
    showMusic(libPath)
})

buttonExemplo.addEventListener('click', function(){

    /*
    * binary buffer to ArrayBuffer, from stackoverflow:
    * http://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer
    */
    function toArrayBuffer(buf) {
        var ab = new ArrayBuffer(buf.length)
        var view = new Uint8Array(ab)
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i]
        }
        return ab
    }


    //from midiFile readme:

    // Your variable with a ArrayBuffer instance containing your MIDI file
    var musicFile = fs.readFileSync('exemplos/garota-de-ipanema.mid')
    var midiBuffer = toArrayBuffer(musicFile)

    // Creating the MIDIFile instance
    var midiFile = new MIDIFile(midiBuffer)

    // Reading headers
    console.log(midiFile.header.getFormat()) // 0, 1 or 2
    console.log(midiFile.header.getTracksCount()) // n

    // Time division
    var time;
    if(midiFile.header.getTimeDivision() === MIDIFileHeader.TICKS_PER_BEAT) {
        time = midiFile.header.getSMPTEFrames()
    } else {
        time = midiFile.header.getTicksPerBeat()
        // midiFile.header.getTicksPerFrame() don't know what is this
    }
    console.log(time);

    // MIDI events retriever
    var events = midiFile.getMidiEvents()
    events[0].subtype // type of [MIDI event](https://github.com/nfroidure/MIDIFile/blob/master/src/MIDIFile.js#L34)
    events[0].playTime // time in ms at wich the event must be played
    events[0].param1 // first parameter
    events[0].param2 // second one

    // Lyrics retriever
    var lyrics = midiFile.getLyrics()
    if ( lyrics.length ) {
        lyrics[0].playTime // Time at wich the text must be displayed
        lyrics[0].text // The text content to be displayed
    }

    // Reading whole track events and filtering them yourself
    var events = midiFile.getTrackEvents(0)

    events.forEach(console.log.bind(console))

    // Or for a single track
    var trackEventsChunk = midiFile.tracks[0].getTrackContent()
    var events = MIDIEvents.createParser(trackEventsChunk)

    var event
    while(event = events.next()) {
        // Printing meta events containing text only
        if(event.type === MIDIEvents.EVENT_META && event.text) {
            console.log('Text meta: '+event.text)
        }
    }
})

