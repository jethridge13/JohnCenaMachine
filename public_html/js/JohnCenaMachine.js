var context;
var themeBuffer;
var themeLoaded = false;
var gainNode;
var beatNode;
var beat1 = false;
var beat1Source;
var beat1Buffer;
var beat2 = false;
var beat2Source;
var beat3 = false;
var beat3Source;
var lowPassFilter;
var highPassFilter;
window.addEventListener('load', init, false);
function init() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        gainNode = context.createGain();
        beatNode = context.createGain();
        themeNode = context.createGain();
        lowPassFilter = context.createBiquadFilter();
        highPassFilter = context.createBiquadFilter();
        loadTheme("./MP3s/MainOctave/0.mp3");
        loadBeat("./MP3s/Beats/Beat1.mp3", 1);

    } catch (e) {
        console.log(e);
        alert('An Error has occurred.');
    }
}

function loadTheme(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        //console.log("Request loaded");
        context.decodeAudioData(request.response, function (buffer) {
            themeBuffer = buffer;
            themeLoaded = true;
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
            switch (n){
                case 1:
                    beat1Buffer = buffer;
                    break;
                case 2:
                    beat2Buffer = buffer;
                    break;
                case 3:
                    beat2Buffer = buffer;
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

function playSound(buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    //source.connect(context.destination);
    source.connect(gainNode);
    gainNode.connect(context.destination);

    source.connect(lowPassFilter);
    lowPassFilter.connect(context.destination);
    lowPassFilter.type = "lowshelf";
    lowPassFilter.value = 440;
    lowPassFilter.gain.value = -100;

    source.connect(highPassFilter);
    highPassFilter.connect(context.destination);
    highPassFilter.type = "highshelf";
    highPassFilter.value = 440;
    highPassFilter.gain.value = -100;

    source.start(0);
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

function updateBeat(n){
    switch(n){
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
        try{
            var source = context.createBufferSource();
            source.buffer = beat1Buffer;
            source.connect(context.destination);
            source.start(0);
            beat1 = true;
            source.loop = 1;
            beat1Source = source;
        } catch(e){
            alert("Sound not yet loaded");
        }
    }
}

function updateBeat2() {
    if (beat2) {
        //console.log("Beat 1 stopping");
        beat2 = false;
        beat2Source.stop();
    } else {
        try{
            var source = context.createBufferSource();
            source.buffer = beat2Buffer;
            source.connect(context.destination);
            source.start(0);
            beat2 = true;
            source.loop = 1;
            beat2Source = source;
        } catch(e){
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
        try{
            var source = context.createBufferSource();
            source.buffer = beat3Buffer;
            source.connect(context.destination);
            source.start(0);
            beat3 = true;
            source.loop = 1;
            beat3Source = source;
        } catch(e){
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

function keySwitch(keyCode) {
    console.log(keyCode);
    try {
        switch (keyCode) {
            case 113:
                playSound(themeBuffer);
                break;
        }
    } catch (e) {
        alert("Sound not yet loaded");
    }
}

function displayCoords(event) {
    var x = event.clientX;
    var y = event.clientY;
    alert(x + " " + y);
}