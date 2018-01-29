Tananã
======

> Software to learn/practice music scores. Because music software needs better UX. Specially for students. (For english speakers, it's pronouced like "*tah-nah-naan*")

![https://ci.appveyor.com/api/projects/status/github/graciano/tanana?svg=true](https://ci.appveyor.com/api/projects/status/github/graciano/tanana?svg=true)


![print](https://i.imgur.com/FYmVeXm.png?2)

### Project motivation

Most of the musicians I know are kind of "*semi iletrate*" in music scores. Myself included. We can read and play music, but not in an efficient way. This project was made so people like that can practice it. Most of music software today is either too professional for that, or the UX is just painful. I think the exception would be *[flat.io](https://flat.io)*, but their goal is not to be an educational software like **Tananã**.

## Project status and milestones

Currently it doesn't work quite well. It just reads a [Music XML](https://usermanuals.musicxml.com/MusicXML/MusicXML.htm#Tutorial.htm%3FTocPath%3DMusicXML%25203.0%2520Tutorial%7C_____0) file and tries to make a music score (like a bazillion other projects already do). [Here is a video](https://drive.google.com/file/d/0BzCvf4xDDyNpWHpveDlud05FRlU/view?usp=sharing) with a demonstration of what the project can do right now. In the future this will be useful to practice music score reading. [Github milestones](https://github.com/graciano/tanana/milestones) are keeping track of what will be implemented, and I'm *dreaming* with having a player that checks if you are playing the score correctly in you MIDI keyboard, for example.

## This project is using:

 - [npm](https://www.npmjs.com/)
 - [gulp](http://gulpjs.com/), install with `npm i -g gulp`
 - [electron](https://electron.atom.io), install with `npm i -g electron`
 - [Open Sheet Music Display](http://opensheetmusicdisplay.org), that reads a music xml and uses [VexFlow](https://github.com/0xfe/vexflow) *to create an svg music score*.

### Yeah, cool, but after I clone the repo, what do I do?

 - `git clone git@github.com:graciano/tanana.git && cd tanana`
 - `npm install` # to install dependencies
 - `gulp watch` to watch sass files
 - `npm run start`to run the applicatio. **Tip: in the screen, cmd+shift+I opens the inspector from chromium**

#### Other warnings and useful links

  - Some of the scores in the example directory aren't working because the software is not stable **:(**
    - Go testing more of them to be sure it's working or not in your machine **;)**
  - Build is not working yet, more info in issue [#9](https://github.com/graciano/tanana/issues/9)
  - [standard js](https://github.com/feross/standard) for using es6.
    - `npm i -g standard` to run tests with `npm run test` and build

## License
BSD-4-Clause License, aka the first license of BSD. (It's small and in the file [LICENSE.md](LICENSE.md), read it and be happy)
