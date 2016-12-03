// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


var MIDIFile = require('midifile', 'src'),
    MIDIFileHeader = require('midifile', 'src', 'MIDIFileHeader'),
    MIDIEvents = require('midievents'),
    vexflow = require('vexflow'),
    fs = require('fs'),
    readdir = require('recursive-readdir')
const {dialog} = require('electron').remote

var buttonExample = document.getElementById('open-example')
var buttonlibrary = document.getElementById('button-library')

const MIDI_FORMATS = ['mid', 'midi']

//todo modularize this spaguetti code

var showMusic = function(path){
    var ulLibrary = document.getElementById('library-view')
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
            ulLibrary.appendChild(li)
          }
      }
    })
}

buttonlibrary.addEventListener('click', function(){
    libPath = dialog.showOpenDialog({properties: ['openDirectory']})[0]
    showMusic(libPath)
})


var midiNoteToString = function(note){
    console.log(note)
}

buttonExample.addEventListener('click', function(){

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
    var musicFile = fs.readFileSync('exemplos/twinkle_twinkle.mid')
    // var musicFile = fs.readFileSync('exemplos/garota-de-ipanema.mid')
    var midiBuffer = toArrayBuffer(musicFile)

    // Creating the MIDIFile instance
    var midiFile = new MIDIFile(midiBuffer)

    // Reading headers
    console.log(midiFile.header.getFormat()) // 0, 1 or 2
    console.log("tracks "+ midiFile.header.getTracksCount()) // n

    // Time division
    var time;
    if(midiFile.header.getTimeDivision() === MIDIFileHeader.TICKS_PER_BEAT) {
        time = midiFile.header.getSMPTEFrames()
        // midiFile.header.getTicksPerFrame() //don't know what is this
    } else {
        time = midiFile.header.getTicksPerBeat()
    }
    console.log("time "+time)

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
    // console.log(events)

    // events.forEach(console.log.bind(console))

    // Or for a single track
    var trackEventsChunk = midiFile.tracks[1].getTrackContent()
    // console.log(trackEventsChunk)
    var events = MIDIEvents.createParser(trackEventsChunk)

    function iterateParamsMidi(event, callback){
        var property, count = 0, go=true
        do{
            count++
            property ='param'+count
            if(go = event.hasOwnProperty(property))
                callback(event[property])
        }while(go)
    }

    var midiNotes = []
    var midiNotesPlaying = []
    var event
    while(event = events.next()) {
        // Printing meta events containing text only
        if(event.type === MIDIEvents.EVENT_META && event.text) {
            console.log('Text meta: '+event.text)
        }
        if(MIDIEvents.EVENT_MIDI_NOTE_ON===event.subtype){
            iterateParamsMidi(event, function(param){
                midiNotesPlaying.push(param)
            })
        }
        else if(MIDIEvents.EVENT_MIDI_NOTE_OFF===event.subtype){
            iterateParamsMidi(event, function(param){
                var i = midiNotesPlaying.indexOf(param)
                if(i==-1){
                    console.log("deu ruim")
                    console.log(param)
                }
                else{
                    console.log('ok')
                    // console.log(event.param2)
                    // console.log(midiNotesPlaying)
                    midiNotes.push(midiNotesPlaying.splice(i, 1)[0])
                }
            })
        }
        //todo handle other midi events

    }
    console.log("notes playing")
    console.log(midiNotesPlaying)
    console.log("notes")
    console.log(midiNotes)


    function StringNote(){
        this.STRING_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    }

    StringNote.prototype.getStringFromMidiNumber = function(number){
        var noteWithoutOctave = Math.floor(number % 12)
        var stringResult = this.STRING_NOTES[noteWithoutOctave]
        var octave = Math.floor(number / 12)
        stringResult+=octave
        //TODO make flats appear too
        return stringResult
    }


    var vf = new vexflow.Flow.Factory({
      renderer: {selector: 'main-score', width: 500, height: 200}
    })

    var score = vf.EasyScore()
    var system = vf.System()

    var vexNotesString = ''

    var sn = new StringNote()
    for (var i =0; i<7; i++) {
        vexNotesString+= sn.getStringFromMidiNumber(midiNotes[i]) +', '
    }
    vexNotesString+= sn.getStringFromMidiNumber(midiNotes[i])
    console.log(vexNotesString)

    system.addStave({
      voices: [
        score.voice(score.notes(vexNotesString, {stem: 'up'})),
        // score.voice(score.notes('C#4/h, C#4', {stem: 'down'}))
      ]
    }).addClef('treble').addTimeSignature('4/4')

    vf.draw()
})

