var context;
var themeBuffer;
var themeLoaded = false;
var gainNode;
var beatNode;
var beat1 = false;
var beat1Source;
var beat2 = false;
var beat2Source;
var beat3 = false;
var beat3Source;
window.addEventListener('load', init, false);
function init() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        gainNode = context.createGain();
        beatNode = context.createGain();
        themeNode = context.createGain();
        loadTheme("./AndHisNameIsJohnCena.mp3");
        
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
        console.log("Request loaded");
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

function playSound(buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.connect(gainNode);
    gainNode.connect(context.destination);
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
    if(beat1){
        beat1Source.stop();
    } else {
        
    }
}

function updateBeat2() {

}

function updateBeat3() {

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