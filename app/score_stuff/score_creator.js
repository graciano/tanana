const vexflow = require('vexflow'),
    musicutil = require('./musicutil.js'),
    checkNested = require('./../util/check-nested.js')

module.exports = function (musicjson, selector, options) {
    if(typeof options !== "object")
        options = {}
    var barWidth = options.hasOwnProperty("bar-width")? 
                   parseInt(options["bar-width"]) : 200
    var lineHeight = options.hasOwnProperty("line-height")?
                   parseInt(options["line-height"]) : 100
    var spaceBetweenStaves = options.hasOwnProperty("space-between-staves")?
                   parseInt(options["space-between-staves"]) : 10
    //todo make this responsive
    var barsPerLine = options.hasOwnProperty("bars-per-line")?
                   parseInt(options["bars-per-line"]) : 3

    var score_elem = document.querySelector(selector)
    console.log(musicjson)
    
    //clean score_elem
    while(score_elem.firstChild)
        score_elem.removeChild(score_elem.firstChild)
    
    var bars = musicjson["score-partwise"]["part"][0]["measure"]
    var first_bar = bars[0]

    var keySignature = musicutil.keySignature(
            first_bar['attributes'][0]['key'][0]['fifths'])
    var divisions = first_bar['attributes'][0]['divisions'][0]
    var timeObj = checkNested(first_bar, 'attributes', 0, 'time', 0)
    var timeSignature = musicutil.timeSignature(timeObj)
    console.log(timeSignature)

    //instantiating vexflow stuff
    var vf = new vexflow.Flow.Factory({
            renderer: {
                selector: score_elem,
                height: 900,
                width: (barsPerLine * barWidth) + spaceBetweenStaves + 5,
            }
        })
    var score = vf.EasyScore()
    score.set({time: timeSignature})

    /*
    * makeSystem like this example:
    * https://github.com/0xfe/vexflow/blob/master/tests/bach_tests.js#L28
    */
    var x = spaceBetweenStaves, y = spaceBetweenStaves;
    function makeSystem(width, breakLine) {
        var system = vf.System({
            x: x,
            y: y,
            width: width,
            spaceBetweenStaves: spaceBetweenStaves,
        })
        if(breakLine)
            y += lineHeight
        if(breakLine) x = spaceBetweenStaves
        else x += width
        return system
    }

    //drawing the first measure with key signature etc
    //todo encapsulate this in a function in musicutil.js
    // or whatever
    
    var system = makeSystem(barWidth)
    // todo calculate size by numbers of notes in measure

    //creating first bar with signature etc
    var voices = musicutil.barEasyScoreVoices(first_bar,
                                              score, timeObj, divisions)

    system.addStave({
        voices: voices
    })
        .addClef('treble') // todo support bass clefs
        .addTimeSignature(timeSignature)
        .addKeySignature(keySignature)

    //creating other bars
    var contBars = 1
    for (var i = 1; i < bars.length; i++) {
        var bar = bars[i]
        system = makeSystem(barWidth, contBars === (barsPerLine - 1))
        contBars++
        contBars %= barsPerLine
        system.addStave({
                voices: musicutil.barEasyScoreVoices(bar,
                                                     score, timeObj, divisions)
            })
    }

    vf.draw()
}
