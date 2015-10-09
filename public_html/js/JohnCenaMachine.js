var context;
var themeBuffer;
var themeLoaded = false;
var gainNode;
var beatNode;
var beat1 = false;
var beat1Source;
var beat1Buffer;
var beat1Loaded;
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
        loadTheme("./AndHisNameIsJohnCena.mp3");
        loadBeat("./Beat1.mp3", beat1Buffer, beat1Loaded);
        
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

function loadBeat(url, beatBuffer, beatBool){
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer){
            beatBuffer = buffer;
            beatBool = true;
            console.log("I did it!");
            beatBuffer.connect(context.destination);
        }, function(error){
            console.log(error);
        });
    };
}

function playSound(buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    //source.connect(context.destination);
    source.connect(gainNode);
    gainNode.connect(context.destination);
    
    source.connect(lowPassFilter);
    lowPassFilter.connect(context.destination);
    lowPassFilter.type="lowshelf";
    lowPassFilter.value=440;
    lowPassFilter.gain.value=-100;
    
    source.connect(highPassFilter);
    highPassFilter.connect(context.destination);
    highPassFilter.type="highshelf";
    highPassFilter.value=440;
    highPassFilter.gain.value=-100;
    
    source.start(0);
}

function updateCenaVolume(val) {
    var volume = val/100;
    //console.log("Volume updated to: " + volume);
    gainNode.gain.value=volume;
}

function updateBeatVolume(val) {
    var volume = val/100;
    beatNode.gain.value=volume;
}

function updateBeat1() {
    console.log(beat1);
    if(beat1){
        console.log("Beat 1 stopping");
        beat1Source.stop();
    } else if (beat1Loaded) {
        var source = context.createBufferSource();
        source.buffer = beat1Buffer;
        source.connect(context.destination);
        source.start(0);
        beat1 = true;
    }
}

function updateBeat2() {

}

function updateBeat3() {

}

function updateLowPassFilter(element){
    var freq = element.value;
    //console.log(freq);
    lowPassFilter.gain.value = freq;
}

function updateHighPassFilter(element){
    var freq = element.value;
    highPassFilter.gain.value = freq;
}

function keySwitch(keyCode) {
    console.log(keyCode);
    if (themeLoaded) {
        switch(keyCode){
            case 113:
                playSound(themeBuffer);
        }
    }
}

function displayCoords(event){
    var x = event.clientX;
    var y = event.clientY;
    alert(x + " " + y);
}