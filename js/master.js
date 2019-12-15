const THREE = require('three');
const Scene = require('./scene');
const Brick = require('./brick');
const Queue = require('./queue');
const socket = require('socket.io-client')(window.location.host);

//==================
//--Define command--
//==================
const SPACE = 0;
const PLAY = 1;
const PAUSE = 2;
const GAMEOVER = 3;
const PLAYAGAIN = 4;

//==================
//---Inisialisasi---
//==================
var scene = new Scene();
let bricks = new Queue();
let brick = new Brick();
let scale = new THREE.Vector3();
let position = new THREE.Vector3();
let command = PLAY, startPos = 6.5, direction = 'x';
let hue = 0;
let scoreValue = 0;
let previousScoreValue = 0;
var scoreDisplay = document.getElementById("score");
var gameoverDisplay = document.getElementById("game-over");

function init() {
    // Mengatur parameter warna berdasarkan nilai hue-nya
    hue = Math.floor(Math.random() * 360);

    // Disable view gameover
    gameoverDisplay.style.display = "none";

    // Membuat tumpukan awal hingga
    // bagian bawah tertutupi
    for(let i = -14;i < 0; i++) {
        brick = new Brick({
            position: new THREE.Vector3(0, i, 0),
            direction: 'z',
            color: "hsl(" + hue +", 100%, 50%)"
        });

        bricks.push(brick);
        scene.add(brick.build);
    }

    // Tumpukan paling atas
    brick = new Brick({
        position: new THREE.Vector3(0, 0, startPos),
        direction: 'z',
        color: "hsl(" + hue +", 100%, 50%)"
    });

    bricks.push(brick);
    scene.add(brick.build);
}
init();

//=======================
//-----Socket client-----
//=======================
const roomName = 'nganu';
socket.emit('join', roomName);
//-----------------------
socket.on('keyboardEvent', function(data) {
    console.log(data);
});

socket.on('deviceOrientation', function(data) {
    console.log(data);
});

socket.on('sync', function(data) {
    for(let i = 0;i < data.property.length; i++) {
        bricks.items[i].position = data.property[i].position;
        bricks.items[i].scale = data.property[i].scale;
        bricks.items[i].color = data.property[i].color;
    }

    if(data.score != previousScoreValue) {
        scoreValue = data.score;
        scoreDisplay.innerHTML = scoreValue;
        previousScoreValue = scoreValue;
    }
});

//=======================
//--Algoritma permainan--
//=======================
function animate() {
    requestAnimationFrame(() => {animate()});
    loop();
}

//-----------------------
function loop() {
    switch (command) {
        // Balok melakukan update
        case PLAY:
            break;

        case PAUSE:
            break;

        // Balok berhenti, memotong, dan stop
        // sesuai kondisi
        case SPACE:
            break;
        case GAMEOVER:
            break;
        case PLAYAGAIN:
            break;
        default:
            break;
    }

    scene.render();
}
animate();
