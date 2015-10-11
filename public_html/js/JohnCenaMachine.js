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
window.addEventListener('load', init, false);
window.onload = function () {
    var c = document.getElementById("myCanvas");
    var context = c.getContext("2d");
    var cena = new Image();
    cena.onload = function () {
        context.drawImage(cena, 0, 0);
    };
    cena.src = "./Cena.jpg";
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
                playSound(sources[1]);
                break;
            case 100:
                playSound(sources[2]);
                break;
            case 102:
                playSound(sources[3]);
                break;
            case 103:
                playSound(sources[4]);
                break;
            case 104:
                playSound(sources[5]);
                break;
            case 106:
                playSound(sources[6]);
                break;
            case 107:
                playSound(sources[7]);
                break;
                //Down Octave
            case 122:
                playSound(downSources[0]);
                break;
            case 120:
                playSound(downSources[1]);
                break;
            case 99:
                playSound(downSources[2]);
                break;
            case 118:
                playSound(downSources[3]);
                break;
            case 98:
                playSound(downSources[4]);
                break;
            case 110:
                playSound(downSources[5]);
                break;
            case 109:
                playSound(downSources[6]);
                break;
            case 44:
                playSound(downSources[6]);
                break;
                //Up Octave
            case 113:
                playSound(upSources[0]);
                break;
            case 119:
                playSound(upSources[1]);
                break;
            case 101:
                playSound(upSources[2]);
                break;
            case 114:
                playSound(upSources[3]);
                break;
            case 116:
                playSound(upSources[4]);
                break;
            case 121:
                playSound(upSources[5]);
                break;
            case 117:
                playSound(upSources[6]);
                break;
            case 105:
                playSound(upSources[7]);
                break;
        }
    } catch (e) {
        alert("Sound not yet loaded");
    }
}

function stopCena() {
    for (var i = 0; i < sources.length; i++) {
        try {
            sources[i].stop();
            downSources[i].stop();
            upSources[i].stop();
        } catch (e) {

        }
    }
}

function displayCoords(event) {
    var x = event.clientX;
    var y = event.clientY;
    console.log(x + ", " + y);
    if (x < 471 && x > 416 && y > 428 && y < 466) {
        playSound(sources[0]);
        //console.log("Playing 0");
    } else if (x < 489 && x > 431 && y < 444 && y > 383) {
        playSound(sources[1]);
        //console.log("Playing 1");
    } else if (x < 513 && x > 458 && y < 417 && y > 357) {
        playSound(sources[2]);
        //console.log("Playing 2");
    } else if (x < 542 && x > 506 && y < 416 && y > 346) {
        playSound(sources[3]);
    } else if (x < 603 && x > 557 && y < 428 && y > 405) {
        playSound(sources[4]);
    }
}