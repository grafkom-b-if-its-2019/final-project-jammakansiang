const THREE = require('three');
const Scene = require('./scene');
const Brick = require('./brick');
const FallingBrick = require('./fallingbrick');
const Queue = require('./queue');
const socket = require('socket.io-client')(window.location.host);
const Physijs = require('physijs-webpack/browserify');

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
let fallingbricks = new Queue();
let fallingbrick = new FallingBrick();
let cutted_bricks = new Queue();
let scale = new THREE.Vector3();
let position = new THREE.Vector3();
let command = PLAY, startPos = 6.5, direction = 'z';
let hue = 0;
let scoreValue = 0;
var scoreDisplay = document.getElementById("score");
var gameoverDisplay = document.getElementById("game-over");
var playagainButton = document.getElementById("playagain");
var isPlay=0;
var myAudio = new Audio('../sound/ingame.mp3');
var geoo;

function init() {
    // Mengatur parameter warna berdasarkan nilai hue-nya
    hue = Math.floor(Math.random() * 360);

    // Disable view gameover
    gameoverDisplay.style.display = "none";

    // Membuat ground tempat pijakan balok
    // var ground_material = Physijs.createMaterial(
    //     new THREE.MeshLambertMaterial({color: 0xffffff}),
    //     1.,
    //     0,1
    // );
    // var ground = new Physijs.BoxMesh(
    //     new THREE.BoxGeometry(5, 1, 5),
    //     ground_material,
    //     0
    // );
    // ground.position.set(0,-13.5,0);
    // scene.add(ground);

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
    // console.log(data);
});

socket.on('deviceOrientation', function(data) {
    // console.log(data);
});

// socket.on('sync', function(data) {
//     // console.log(data);
//     for(let i = 0;i < bricks.size(); i++) {
//         bricks.items[i].position = data.position[i];
//         bricks.items[i].scale = data.scale[i];
//     }
// });

//=======================
//--Algoritma permainan--
//=======================
function animate() {
    scene.simulate();
    requestAnimationFrame(() => {animate()});
    loop();
}

// distraksi hujan Box
function spawnBox() {
    var xrandom = 2, zrandom = -2;
    let i;
    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    function getXRandom(xrandom){
        while (xrandom >= -2 && xrandom <= 2) {
            xrandom = getRandomArbitrary(-10,10);
        }
        return xrandom;
    }
    function getZRandom(zrandom){
        while (zrandom >= -2 && zrandom <= 2) {
            zrandom = getRandomArbitrary(-10,10);
        }
        return zrandom;
    }
    i = Math.round(getRandomArbitrary(1,5));
    // Hujan paling atas
    for (let e = 0; e < i; e++) {
        xrandom = getXRandom(xrandom);
        zrandom = getZRandom(zrandom);
        // console.log(i,zrandom,xrandom,"ok");
        fallingbrick = new FallingBrick({
            position: new THREE.Vector3(xrandom, 20, zrandom),
            direction: 'z',
            color: "hsl(" + hue +", 100%, 50%)"
        });
    
        fallingbricks.push(fallingbrick);
        scene.add(fallingbrick.build);   
    }
}

//-----------------------
function loop() {
    brick = bricks.back();
    switch (command) {
        // Balok melakukan update
        case PLAY:
            brick.move();

            // hapus box distraksi jika melewati y <= 0
            for(let i = 0;i < fallingbricks.size(); i++)
                if(fallingbricks.items[i].params.position.y <= 0)
                    scene.remove(fallingbricks.items[i].name);

            let message = {
                score: scoreValue,
                property: []
            };
            
            for(let i = 0;i < bricks.size(); i++) {
                let object = {
                    position: bricks.items[i].position,
                    scale: bricks.items[i].scale,
                    hue: bricks.items[i].color.h
                };
                message.property.push(object);
            }

            socket.emit('sync', message);
            nambahlagu();
            break;

        case PAUSE:
            break;
        // Balok berhenti, memotong, dan stop
        // sesuai kondisi

        case SPACE:
            if(cutted_bricks.size>3){
                scene.remove(cutted_bricks.front().name)
                cutted_bricks.pop()
            }
            prevBrick = bricks.get(bricks.size() - 2);
            // distraksi box
            spawnBox();
            
            // Jika balok masih bisa memotong, maka loop lanjut
            var cutted_brick = brick.cut(prevBrick);
            if(cutted_brick[0]) {
                // Balok baru berupa potongan akan dapat efek Physijs
                // var fallingbrick = new FallingBrick(prevBrick.params);
                // fallingbricks.push(fallingbrick);
                // scene.add(fallingbrick.build);
                if(brick.params.direction == 'x' && !cutted_brick[5]) {
                    if (cutted_brick[1].x<cutted_brick[3].x){
                        var a_fallingbrick = new FallingBrick({
                            position: new THREE.Vector3(cutted_brick[3].x + Number((brick.scale.x).toFixed(1)), -1, cutted_brick[3].z),
                            scale: new THREE.Vector3(cutted_brick[2].x, 1, Number((brick.scale.z).toFixed(1))),
                            direction: 'z',
                            color: "hsl(" + hue +", 100%, 50%)"
                        });    
                        // fallingbricks.push(fallingbrick);
                        scene.add(a_fallingbrick.build);
                        cutted_bricks.push(a_fallingbrick)
                    }
                    else{
                        var a_fallingbrick = new FallingBrick({
                            position: new THREE.Vector3(cutted_brick[3].x - Number((brick.scale.x).toFixed(1)), -1, cutted_brick[3].z),
                            scale: new THREE.Vector3(cutted_brick[2].x, 1, Number((brick.scale.z).toFixed(1))),
                            direction: 'z',
                            color: "hsl(" + hue +", 100%, 50%)"
                        });    
                        // fallingbricks.push(fallingbrick);
                        scene.add(a_fallingbrick.build);
                        cutted_bricks.push(a_fallingbrick)
                    }
                }
                else if(brick.params.direction == 'z' && !cutted_brick[5]) {
                    if (cutted_brick[1].z<cutted_brick[3].z){
                        var a_fallingbrick = new FallingBrick({
                            position: new THREE.Vector3(cutted_brick[3].x, -1, cutted_brick[3].z + Number((brick.scale.z).toFixed(1))),
                            scale: new THREE.Vector3(Number((brick.scale.x).toFixed(1)), 1, cutted_brick[2].z),
                            direction: 'z',
                            color: "hsl(" + hue +", 100%, 50%)"
                        });    
                        // fallingbricks.push(fallingbrick);
                        scene.add(a_fallingbrick.build);
                        cutted_bricks.push(a_fallingbrick)
                    }
                    else{
                        var a_fallingbrick = new FallingBrick({
                            position: new THREE.Vector3(cutted_brick[3].x, -1, cutted_brick[3].z - Number((brick.scale.z).toFixed(1))),
                            scale: new THREE.Vector3(Number((brick.scale.x).toFixed(1)), 1, cutted_brick[2].z),
                            direction: 'z',
                            color: "hsl(" + hue +", 100%, 50%)"
                        });    
                        // fallingbricks.push(fallingbrick);
                        scene.add(a_fallingbrick.build);
                        cutted_bricks.push(a_fallingbrick)
                    }     
                }

                bricks.set(brick);
    
                // Untuk setiap stepnya, balok yang lama turun 1 kotak
                for(let i = 0;i < bricks.size(); i++)
                    bricks.items[i].down();

                // Jika balok berjalan di-arah x,
                // mengatur direction menjadi 'x'
                if(direction == 'x') {
                    var topBrick = new Brick({
                        position: new THREE.Vector3(-startPos, 0, brick.position.z),
                        scale: new THREE.Vector3(brick.scale.x, brick.scale.y, brick.scale.z),
                        color: "hsl(" + hue +", 100%, 50%)",
                        direction: direction
                    });
                    // Update agar variasi
                    direction = 'z';
                    startPos = -startPos;
                }
                // Jika balok berjalan di-arah z,
                // mengatur direction menjadi 'z'
                else if(direction == 'z') {
                    var topBrick = new Brick({
                        position: new THREE.Vector3(brick.position.x, 0, startPos),
                        scale: new THREE.Vector3(brick.scale.x, brick.scale.y, brick.scale.z),
                        color: "hsl(" + hue +", 100%, 50%)",
                        direction: direction
                    });
                    // Update agar variasi
                    direction = 'x';
                }
        
                // Menambahkan balok baru
                // Membuang balok lama
                scene.add(topBrick.build);
                scene.remove(bricks.front().name);
                bricks.pop();
                bricks.push(topBrick);
                
                // Mengatur parameter warna agar dinamis,
                // berdasarkan tingkat nilai Hue-nya.
                hue = (hue + 5) % 360;

                // Update score
                scoreValue++;
                if(cutted_brick[5]==true){
                    scoreValue++;
                }
                scoreDisplay.innerHTML = scoreValue;

                // mengembalikan state menjadi play
                command = PLAY;
            }
            // Jika balok tidak bisa memotong (game over)
            else {
                // Balok akan dapat efek Physijs
                // var fallingbrick = new FallingBrick(prevBrick.params);
                // fallingbricks.push(fallingbrick);
                // scene.remove(prevBrick.name);
                // scene.add(fallingbrick.build);

                command = GAMEOVER;
                var gameover = new Audio('../sound/gameover.mp3');
                gameover.play();
            }
            break;
        case GAMEOVER:
            // Drop semua block
            for(let i = 0;i < bricks.size(); i++)
                scene.remove(bricks.items[i].name);
            bricks.clear();

            // // Drop semua falling block
            for(let i = 0;i < fallingbricks.size(); i++)
                scene.remove(fallingbricks.items[i].name);
            fallingbricks.clear();

            // Enable view gameover
            gameoverDisplay.style.display = "block";
            playagainButton.onclick = function() {
                command = PLAYAGAIN;
            }

            break;
        case PLAYAGAIN:
            // re-inisialisasi semua block
            init();

            // reset score
            scoreValue = 0;
            scoreDisplay.innerHTML = scoreValue;

            command = PLAY;
           
        default:
            break;
    }

    scene.render();
}
animate();

//===================
//---Event Handler---
//===================
/**
 * 
 * @param {KeyboardEvent} event 
 */
function onKeyDown(event) {
    switch (event.code) {
        case "Space":
            if(command == PLAY)
                command = SPACE;
                var spasi = new Audio('../sound/spasi.mp3');
                spasi.play();
            break;
        case "KeyP":
            if(command == PLAY)
                command = PAUSE;
            else if(command == PAUSE)
                command = PLAY;
        case "Enter":
            if(command == GAMEOVER)
                command = PLAYAGAIN;
        default:
            break;
    }
    // socket.emit('keyboardEvent', event.code);
}

/**
 * 
 * @param {TouchEvent} event 
 */
function onTouchEvent(event) {
    if(command == PLAY)
    {
        command = SPACE;
    }
    else if(command == GAMEOVER)
    {
        // command = PLAYAGAIN;
    }
        
}

/**
 * 
 * @param {DeviceOrientationEvent} event 
 */
function handleOrientation(event) {
    var orientation = {
        alpha: Math.round(event.alpha),
        beta: Math.round(event.beta),
        gamma: Math.round(event.gamma)
    }
    // socket.emit('deviceOrientation', orientation);
}

if(window.DeviceOrientationEvent){
    
}else {
    alert('DeviceOrientationEvent is not supported');
}

window.addEventListener('touchstart', onTouchEvent);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('deviceorientation', handleOrientation);

function nambahlagu(){
    if(isPlay==0)
    {
        myAudio.play();
    }
    else if (isPlay==1)
    {
        myAudio.stop();
    }
}

//font
function tulisan(){
    var loader = new THREE.FontLoader();

    loader.load( '../fonts/perfect.typeface.json', function ( font ) {
    
        var geometry = new THREE.TextGeometry( 'Perfect', {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        } );
    } );

    geoo= createMesh(geometry);
    geoo.position.x=100;
    geoo.position.y=100;
    scene.add(geoo);
}

