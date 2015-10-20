var context;
var buffers;
var downBuffers;
var upBuffers;
var sources;
var downSources;
var upSources;
var themeLoaded = false;
var gainNode;
var beatNode;
var beat1 = false;
var beat1Source;
var beat1Buffer;
var beat2 = false;
var beat2Source;
var beat2Buffer;
var beat3 = false;
var beat3Source;
var beat3Buffer;
var lowPassFilter;
var highPassFilter;
var lowPass;
var highPass;
var keyLevel;
var soundsPlaying = [];
var canvas;
var cena;
var logo;

window.addEventListener('load', init, false);
window.onload = function () {
    keyLevel = 0;
    var c = document.getElementById("myCanvas");
    canvas = c.getContext("2d");
    cena = new Image();
    cena.onload = function () {
        canvas.drawImage(cena, 0, 0);
    };
    cena.src = "./Cena.jpg";
    logo = new Image();
    logo.src = "./Logo.jpg";
    $("#content").hide();
};
function init() {
    try {
        buffers = [null, null, null, null, null, null, null, null];
        downBuffers = [null, null, null, null, null, null, null, null];
        upBuffers = [null, null, null, null, null, null, null, null];
        sources = [null, null, null, null, null, null, null, null];
        downSources = [null, null, null, null, null, null, null, null];
        upSources = [null, null, null, null, null, null, null, null];
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        gainNode = context.createGain();
        beatNode = context.createGain();
        themeNode = context.createGain();
        lowPassFilter = context.createBiquadFilter();
        highPassFilter = context.createBiquadFilter();
        lowPass = context.createBiquadFilter();
        highPass = context.createBiquadFilter();
        loadSounds();
        //TODO This isn't the best way of dealing with it.
        //Perhaps find a better way?
        setTimeout(loadSources, 7000);
        //loadTheme("./MP3s/MainOctave/0.mp3");
        loadBeat("./MP3s/Beats/Beat1.mp3", 1);
        loadBeat("./MP3s/Beats/Beat2.mp3", 2);
        loadBeat("./MP3s/Beats/Beat3.mp3", 3);
    } catch (e) {
        console.log(e);
        alert('An Error has occurred.');
    }
}

function showCena() {
    $("#content").show();
    $("#start").hide();
}

function loadSounds() {
//Main Octave Loop
    for (var i = 0; i < 8; i++) {
        var string = "./MP3s/MainOctave/";
        string += i;
        string += ".mp3";
        loadTheme(string, 0, i);
    }
    for (var i = 0; i < 8; i++) {
        var string = "./MP3s/DownOctave/";
        string += i;
        string += ".mp3";
        loadTheme(string, 1, i);
    }
    for (var i = 0; i < 8; i++) {
        var string = "./MP3s/UpOctave/";
        string += i;
        string += ".mp3";
        loadTheme(string, 2, i);
    }
}

function loadSources() {
    for (var i = 0; i < 8; i++) {
        var source = context.createBufferSource();
        //console.log(i + ": " + buffers[i]);
        source.buffer = buffers[i];
        source.connect(gainNode);
        gainNode.connect(lowPassFilter);
        gainNode.connect(context.destination);
        lowPassFilter.connect(context.destination);
        lowPassFilter.type = "lowshelf";
        lowPassFilter.value = 440;
        lowPassFilter.gain.value = -100;
        highPassFilter.connect(lowPass);
        highPassFilter.type = "highshelf";
        highPassFilter.value = 440;
        highPassFilter.gain.value = -100;
        lowPass.connect(highPass);
        lowPass.type = "lowpass";
        lowPass.frequency = 0;
        highPass.connect(context.destination);
        highPass.type = "highpass";
        highPass.frequency = 0;
        sources[i] = source;
    }
    for (var i = 0; i < 8; i++) {
        var source = context.createBufferSource();
        //console.log(i + ": " + downBuffers[i]);
        source.buffer = downBuffers[i];
        source.connect(gainNode);
        gainNode.connect(lowPassFilter);
        gainNode.connect(context.destination);
        lowPassFilter.connect(highPassFilter);
        lowPassFilter.type = "lowshelf";
        lowPassFilter.value = 440;
        lowPassFilter.gain.value = -100;
        highPassFilter.connect(lowPass);
        highPassFilter.type = "highshelf";
        highPassFilter.value = 440;
        highPassFilter.gain.value = -100;
        lowPass.connect(highPass);
        lowPass.type = "lowpass";
        lowPass.frequency = 0;
        highPass.connect(context.destination);
        highPass.type = "highpass";
        highPass.frequency = 0;
        downSources[i] = source;
    }
    for (var i = 0; i < 8; i++) {
        var source = context.createBufferSource();
        //console.log(i + ": " + upBuffers[i]);
        source.buffer = upBuffers[i];
        source.connect(gainNode);
        gainNode.connect(lowPassFilter);
        gainNode.connect(context.destination);
        lowPassFilter.connect(highPassFilter);
        lowPassFilter.type = "lowshelf";
        lowPassFilter.value = 440;
        lowPassFilter.gain.value = -100;
        highPassFilter.connect(lowPass);
        highPassFilter.type = "highshelf";
        highPassFilter.value = 440;
        highPassFilter.gain.value = -100;
        lowPass.connect(highPass);
        lowPass.type = "lowpass";
        lowPass.frequency = 0;
        highPass.connect(context.destination);
        highPass.type = "highpass";
        highPass.frequency = 0;
        upSources[i] = source;
    }
}

function loadTheme(url, n, i) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        //console.log("Request loaded");
        context.decodeAudioData(request.response, function (buffer) {
            switch (n) {
                case 0:
                    buffers[i] = buffer;
                    break;
                case 1:
                    downBuffers[i] = buffer;
                    break
                case 2:
                    upBuffers[i] = buffer;
                    break;
            }
            //themeLoaded = true;
            themeNode.connect(context.destination);
        }, function (error) {
            console.log(error);
        });
    };
    request.send();
}

function loadBeat(url, n) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        context.decodeAudioData(request.response, function (buffer) {
            switch (n) {
                case 1:
                    beat1Buffer = buffer;
                    break;
                case 2:
                    beat2Buffer = buffer;
                    break;
                case 3:
                    beat3Buffer = buffer;
                    break;
            }
            bufferReturn = buffer;
            beatNode.connect(context.destination);
        }, function (error) {
            console.log(error);
        });
    };
    request.send();
}

function playSound(source, n, i) {
    source.start(0);
    soundsPlaying.push(source);
    setTimeout(stopSoundPlaying, 13500);
    //TODO Timer for the length of the song.
    switch (n) {
        case 0:
            var source = context.createBufferSource();
            //console.log(i + ": " + upBuffers[i]);
            source.buffer = buffers[i];
            //source.connect(context.destination);
            source.connect(gainNode);
            gainNode.connect(lowPassFilter);
            gainNode.connect(context.destination);
            lowPassFilter.connect(highPassFilter);
            lowPassFilter.type = "lowshelf";
            lowPassFilter.value = 440;
            lowPassFilter.gain.value = -100;
            highPassFilter.connect(lowPass);
            highPassFilter.type = "highshelf";
            highPassFilter.value = 440;
            highPassFilter.gain.value = -100;
            lowPass.connect(highPass);
            lowPass.type = "lowpass";
            lowPass.frequency = 0;
            highPass.connect(context.destination);
            highPass.type = "highpass";
            highPass.frequency = 0;
            sources[i] = source;
            break;
        case 1:
            var source = context.createBufferSource();
            //console.log(i + ": " + upBuffers[i]);
            source.buffer = downBuffers[i];
            //source.connect(context.destination);
            source.connect(gainNode);
            gainNode.connect(lowPassFilter);
            gainNode.connect(context.destination);
            lowPassFilter.connect(highPassFilter);
            lowPassFilter.type = "lowshelf";
            lowPassFilter.value = 440;
            lowPassFilter.gain.value = -100;
            highPassFilter.connect(lowPass);
            highPassFilter.type = "highshelf";
            highPassFilter.value = 440;
            highPassFilter.gain.value = -100;
            lowPass.connect(highPass);
            lowPass.type = "lowpass";
            lowPass.frequency = 0;
            highPass.connect(context.destination);
            highPass.type = "highpass";
            highPass.frequency = 0;
            downSources[i] = source;
            break;
        case 2:
            var source = context.createBufferSource();
            //console.log(i + ": " + upBuffers[i]);
            source.buffer = upBuffers[i];
            //source.connect(context.destination);
            source.connect(gainNode);
            gainNode.connect(lowPassFilter);
            gainNode.connect(context.destination);
            lowPassFilter.connect(highPassFilter);
            lowPassFilter.type = "lowshelf";
            lowPassFilter.value = 440;
            lowPassFilter.gain.value = -100;
            highPassFilter.connect(lowPass);
            highPassFilter.type = "highshelf";
            highPassFilter.value = 440;
            highPassFilter.gain.value = -100;
            lowPass.connect(highPass);
            lowPass.type = "lowpass";
            lowPass.frequency = 0;
            highPass.connect(context.destination);
            highPass.type = "highpass";
            highPass.frequency = 0;
            upSources[i] = source;
            break;
    }
}

function updateCenaVolume(val) {
    var volume = val / 100;
    //console.log("Volume updated to: " + volume);
    gainNode.gain.value = volume;
}

function updateBeatVolume(val) {
    var volume = val / 100;
    beatNode.gain.value = volume;
}

function updateBeat(n) {
    switch (n) {
        case 1:
            updateBeat1();
            break;
        case 2:
            updateBeat2();
            break;
        case 3:
            updateBeat3();
            break;
    }
}

function updateBeat1() {
//console.log(beat1);
//console.log(beat1Loaded);
    if (beat1) {
//console.log("Beat 1 stopping");
        beat1 = false;
        beat1Source.stop();
    } else {
        try {
            var source = context.createBufferSource();
            source.buffer = beat1Buffer;
            //source.connect(context.destination);
            source.connect(beatNode);
            beatNode.connect(context.destination);
            source.start(0);
            beat1 = true;
            source.loop = 1;
            beat1Source = source;
        } catch (e) {
            alert("Sound not yet loaded");
            console.log(e);
        }
    }
}

function updateBeat2() {
    if (beat2) {
//console.log("Beat 1 stopping");
        beat2 = false;
        beat2Source.stop();
    } else {
        try {
            var source = context.createBufferSource();
            source.buffer = beat2Buffer;
            source.connect(beatNode);
            beatNode.connect(context.destination);
            source.start(0);
            beat2 = true;
            source.loop = 1;
            beat2Source = source;
        } catch (e) {
            alert("Sound not yet loaded");
        }
    }
}

function updateBeat3() {
    if (beat3) {
//console.log("Beat 1 stopping");
        beat3 = false;
        beat3Source.stop();
    } else {
        try {
            var source = context.createBufferSource();
            source.buffer = beat3Buffer;
            source.connect(beatNode);
            beatNode.connect(context.destination);
            source.start(0);
            beat3 = true;
            source.loop = 1;
            beat3Source = source;
        } catch (e) {
            alert("Sound not yet loaded");
        }
    }
}

function updateLowPassFilter(element) {
    var freq = element.value;
    //console.log(freq);
    lowPassFilter.gain.value = freq;
}

function updateHighPassFilter(element) {
    var freq = element.value;
    highPassFilter.gain.value = freq;
}

function updateLowPass(element) {
    var freq = element.value;
    lowPass.frequency = freq;
}

function updateHighPass(element) {
    var freq = element.value;
    highPass.frequency = freq;
}

function keySwitch(keyCode) {
    console.log(keyCode);
    try {
        switch (keyCode) {
            //Main Octave
            case 97:
                playSound(sources[0], 0, 0);
                break;
            case 115:
                playSound(sources[1], 0, 1);
                break;
            case 100:
                playSound(sources[2], 0, 2);
                break;
            case 102:
                playSound(sources[3], 0, 3);
                break;
            case 103:
                playSound(sources[4], 0, 4);
                break;
            case 104:
                playSound(sources[5], 0, 5);
                break;
            case 106:
                playSound(sources[6], 0, 6);
                break;
            case 107:
                playSound(sources[7], 0, 7);
                break;
                //Down Octave
            case 122:
                playSound(downSources[0], 1, 0);
                break;
            case 120:
                playSound(downSources[1], 1, 1);
                break;
            case 99:
                playSound(downSources[2], 1, 2);
                break;
            case 118:
                playSound(downSources[3], 1, 3);
                break;
            case 98:
                playSound(downSources[4], 1, 4);
                break;
            case 110:
                playSound(downSources[5], 1, 5);
                break;
            case 109:
                playSound(downSources[6], 1, 6);
                break;
            case 44:
                playSound(downSources[7], 1, 7);
                break;
                //Up Octave
            case 113:
                playSound(upSources[0], 2, 0);
                break;
            case 119:
                playSound(upSources[1], 2, 1);
                break;
            case 101:
                playSound(upSources[2], 2, 2);
                break;
            case 114:
                playSound(upSources[3], 2, 3);
                break;
            case 116:
                playSound(upSources[4], 2, 4);
                break;
            case 121:
                playSound(upSources[5], 2, 5);
                break;
            case 117:
                playSound(upSources[6], 2, 6);
                break;
            case 105:
                playSound(upSources[7], 2, 7);
                break;
        }
    } catch (e) {
        alert("Sound not yet loaded");
    }
}

function stopCena() {
    for (var i = 0; i < soundsPlaying.length; i++) {
        soundsPlaying[i].stop();
    }
    soundsPlaying = [];
}

function stopSoundPlaying() {
    soundsPlaying.shift();
}

function upKey() {
    //console.log("UP!");
    if (keyLevel < 3) {
        keyLevel++;
    }
}

function downKey() {
    //console.log("DOWN!");
    if (keyLevel > -2) {
        keyLevel--;
    }
}

function refreshCanvas() {
    //console.log("Refreshinc canvas...");
    canvas.drawImage(cena, 0, 0);
}

function displayCoords(event) {
    var x = event.clientX;
    var y = event.clientY;
    //console.log(x + ", " + y);
    if (x < 587 && x > 505 && y < 566 && y > 484) {
        x -= 32;
        y -= 180;
        canvas.drawImage(logo, x, y);
        upKey();
        y = 0;
    } else if (x < 608 && x > 510 && y < 640 && y > 570) {
        x -= 32;
        y -= 180;
        canvas.drawImage(logo, x, y);
        downKey();
        x = 0;
    }
    switch (keyLevel) {
        case 0:
            if (x < 471 && x > 416 && y > 428 && y < 466) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(97);
                //console.log("Playing 0");
            } else if (x < 489 && x > 431 && y < 444 && y > 383) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(115);
                //console.log("Playing 1");
            } else if (x < 513 && x > 458 && y < 417 && y > 357) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(100);
                //console.log("Playing 2");
            } else if (x < 542 && x > 506 && y < 416 && y > 346) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(102);
            } else if (x < 603 && x > 557 && y < 428 && y > 405) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(103);
            }
            break;
        case 1:
            if (x < 471 && x > 416 && y > 428 && y < 466) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(104);
                //console.log("Playing 0");
            } else if (x < 489 && x > 431 && y < 444 && y > 383) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(106);
                //console.log("Playing 1");
            } else if (x < 513 && x > 458 && y < 417 && y > 357) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(107);
                //console.log("Playing 2");
            } else if (x < 542 && x > 506 && y < 416 && y > 346) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(113);
            } else if (x < 603 && x > 557 && y < 428 && y > 405) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(119);
            }
            break;
        case 2:
            if (x < 471 && x > 416 && y > 428 && y < 466) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(101);
                //console.log("Playing 0");
            } else if (x < 489 && x > 431 && y < 444 && y > 383) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(114);
                //console.log("Playing 1");
            } else if (x < 513 && x > 458 && y < 417 && y > 357) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(116);
                //console.log("Playing 2");
            } else if (x < 542 && x > 506 && y < 416 && y > 346) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(121);
            } else if (x < 603 && x > 557 && y < 428 && y > 405) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(117);
            }
            break;
        case 3:
            if (x < 471 && x > 416 && y > 428 && y < 466) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(114);
                //console.log("Playing 0");
            } else if (x < 489 && x > 431 && y < 444 && y > 383) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(116);
                //console.log("Playing 1");
            } else if (x < 513 && x > 458 && y < 417 && y > 357) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(121);
                //console.log("Playing 2");
            } else if (x < 542 && x > 506 && y < 416 && y > 346) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(117);
            } else if (x < 603 && x > 557 && y < 428 && y > 405) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(105);
            }
            break;
        case -1:
            if (x < 471 && x > 416 && y > 428 && y < 466) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(118);
                //console.log("Playing 0");
            } else if (x < 489 && x > 431 && y < 444 && y > 383) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(98);
                //console.log("Playing 1");
            } else if (x < 513 && x > 458 && y < 417 && y > 357) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(110);
                //console.log("Playing 2");
            } else if (x < 542 && x > 506 && y < 416 && y > 346) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(109);
            } else if (x < 603 && x > 557 && y < 428 && y > 405) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(44);
            }
            break;
        case -2:
            if (x < 471 && x > 416 && y > 428 && y < 466) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(122);
                //console.log("Playing 0");
            } else if (x < 489 && x > 431 && y < 444 && y > 383) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(120);
                //console.log("Playing 1");
            } else if (x < 513 && x > 458 && y < 417 && y > 357) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(99);
                //console.log("Playing 2");
            } else if (x < 542 && x > 506 && y < 416 && y > 346) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(118);
            } else if (x < 603 && x > 557 && y < 428 && y > 405) {
                x -= 32;
                y -= 180;
                canvas.drawImage(logo, x, y);
                keySwitch(98);
            }
            break;
    }
    //setTimeout(refreshCanvas, 500);
}