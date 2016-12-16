var vexflow = require('vexflow'),
    musicutil = require('./musicutil.js')

module.exports = function (musicjson) {
    var main_score_elem = document.querySelector("#main-score")
    console.log(musicjson)
    
    //clean main_score_elem
    while(main_score_elem.firstChild)
        main_score_elem.removeChild(main_score_elem.firstChild)
    
    var bars = musicjson["score-partwise"]["part"][0]["measure"]
    var first_bar = bars[0]

    var keySignature = musicutil.keySignature(
            first_bar['attributes'][0]['key'][0]['fifths'])
    var divisions = first_bar['attributes'][0]['divisions'][0]
    var timeObj = first_bar['attributes'][0]['time'][0]
    var timeSignature = musicutil.timeSignature(timeObj)
    console.log(timeSignature)

    //instantiating vexflow stuff
    var vf = new vexflow.Flow.Factory({
            renderer: {selector: main_score_elem}
        })
    var score = vf.EasyScore()
    score.set({time: timeSignature})

    /*
    * makeSystem like this example:
    * https://github.com/0xfe/vexflow/blob/master/tests/bach_tests.js#L28
    */
    var x = 0, y = 0;
    function makeSystem(width) {
        var system = vf.System({
            x: x,
            y: y,
            width: width,
            spaceBetweenStaves: 10
        })
        x += width
        return system
    }

    //drawing the first measure with key signature etc
    //todo encapsulate this in a function in musicutil.js
    // or whatever
    
    var system = makeSystem(220)
    // todo calculate size by numbers of notes in measure
    var voices = musicutil.barEasyScoreVoices(first_bar,
                                              score, timeObj, divisions)

    system.addStave({
        voices: voices
    })
        .addClef('treble') // todo support bass clefs
        .addTimeSignature(timeSignature)
        .addKeySignature(keySignature)
    for (var i = 1; i < 4; i++) {
        var bar = bars[i]
        system = makeSystem(180)
        system.addStave({
                voices: musicutil.barEasyScoreVoices(bar,
                                                     score, timeObj, divisions)
            })
    }

    vf.draw()
}
