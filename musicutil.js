
function MusicUtil(){
    this.FIFTHS_CICLE = [
        'C',  'G',  'D',  'A',  'E',  'B',
        'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'
    ]
}

/**
* @return string of key signature
* @arg sharpsOrFlats: if number is not negative, 
*      consider number of sharps, if negative,
*      flats.
*/
MusicUtil.prototype.keySignature = function(sharpsOrFlats) {
    return this.FIFTHS_CICLE[sharpsOrFlats % 12]
}

/**
* @return string of key time signature
* @arg timeObj from musicXML format
*/
MusicUtil.prototype.timeSignature = function(timeObj) {
    return  timeObj["beats"][0]
            +"/"+timeObj["beat-type"][0]
}

MusicUtil.prototype.convertTypeDuration = function(type) {
    if(type.toLowerCase()==="quarter")
        return 4
};

MusicUtil.prototype.noteString = function(note, timeObj, divisions) {
    var duration_xml = parseInt(note["duration"][0])
    var beats = parseInt(timeObj["beats"][0])
    var beatType = parseInt(timeObj["beat-type"][0])
    // var duration = (duration_xml / beats) * beatType

    var max_duration = beats * beatType
    duration_xml = duration_xml > max_duration ? max_duration : duration_xml
    var duration = (divisions / duration_xml) * beatType
    duration = duration < 1 ? 1 : duration

    var noteString
    if(note.hasOwnProperty("pitch"))
        noteString = note["pitch"][0]["step"] + note["pitch"][0]["octave"]
    else if(note.hasOwnProperty("rest"))
        noteString = "B4"
    else
        return new Error("note has no rest or pitch")
    
    noteString += "/"
    if(note.hasOwnProperty("rest"))
        noteString+="r"
    noteString += duration
    return  noteString
}

MusicUtil.prototype.barEasyScoreVoices = function(bar, score, timeObj, divisions) {
    var voices_xml = {}

    //for each note in xml, put it in a array of easyScore strings
    //using this.noteString
    for (var i =0 ; i < bar["note"].length; i++) {
        var note = bar["note"][i]

        var voice_id_xml = parseInt(note["voice"][0])
        var notes
        
        if(voices_xml.hasOwnProperty(voice_id_xml)){
            notes = voices_xml[voice_id_xml]
        }
        else{
            voices_xml[voice_id_xml] = []
            notes = []
        }

        notes.push(this.noteString(note, timeObj, divisions))

        voices_xml[voice_id_xml] = notes
    }

    //generating easy score voices
    var voices = []
    for(var voice_id in voices_xml){
        var notes_array = voices_xml[voice_id]
        console.log(notes_array.join(", "))
        voices.push(score.voice(score.notes(notes_array.join())))
    }
    return voices
}

module.exports = new MusicUtil()
