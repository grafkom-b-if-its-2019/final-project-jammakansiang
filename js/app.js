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
const STOP = 3;

//==================
//---Inisialisasi---
//==================
var scene = new Scene();
let bricks = new Queue();
let brick = new Brick();
let scale = new THREE.Vector3();
let position = new THREE.Vector3();
let command, startPos = 6.5, direction = 'x';
let hue = 220;

function init() {
    // Membuat tumpukan awal hingga
    // bagian bawah tertutupi
    for(let i = -14;i < 0; i++) {
        brick = new Brick({
            position: new THREE.Vector3(0, i, 0),
            direction: 'z'
        });
    
        bricks.push(brick);
        scene.add(brick.build);
    }

    // Tumpukan paling atas
    brick = new Brick({
        position: new THREE.Vector3(0, 0, startPos),
        direction: 'z'
    });

    bricks.push(brick);
    scene.add(brick.build);
}
init();

//=======================
//--Algoritma permainan--
//=======================
function animate() {
    requestAnimationFrame(() => {animate()});
    loop();
}

function loop() {
    switch (command) {
        // Balok melakukan update
        case PLAY:
            brick = bricks.back();
            brick.move();
            break;
        // Balok berhenti, memotong, dan stop
        // sesuai kondisi
        case SPACE:
            brick.stop();
            prevBrick = bricks.get(bricks.size() - 2);
            
            // Jika balok masih bisa memotong, maka loop lanjut
            if(brick.cut(prevBrick)) {
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
                // Jika balok berjalan di-arah x,
                // mengatur direction menjadi 'x'
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
                scene.remove(bricks.front().build);
                bricks.pop();
                bricks.push(topBrick);
                
                // Mengatur parameter warna agar dinamis,
                // berdasarkan tingkat nilai Hue-nya.
                hue = (hue + 5) % 360;

                // mengembalikan state menjadi play
                command = PLAY;
            }
            // Jika balok tidak bisa memotong (game over)
            else {
                command = STOP;
            }
            break;
        case STOP:
            
            break;
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
            command = SPACE;
            break;
        
        default:
            break;
    }
}

/**
 * 
 * @param {TouchEvent} event 
 */
function onTouchEvent(event) {
    command = SPACE;
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
    socket.emit('deviceOrientation', orientation);
}

window.addEventListener('touchstart', onTouchEvent);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('deviceorientation', handleOrientation);