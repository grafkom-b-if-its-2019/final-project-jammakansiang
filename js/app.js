const THREE = require('three');
const Scene = require('./scene');
const Brick = require('./brick');
const Queue = require('./queue');

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
    brick = bricks.back();
    brick.move();

    if(command == SPACE) {

        prevBrick = bricks.get(bricks.size() - 2);
        brick.stop();
        if(!brick.cut(prevBrick))
            command = STOP;

        bricks.set(brick);

        // Untuk setiap stepnya, balok yang lama turun 1 kotak
        for(let i = 0;i < bricks.size(); i++)
            bricks.items[i].down();

        if(direction == 'x') {
            var topBrick = new Brick({
                position: new THREE.Vector3(-startPos, 0, brick.position.z),
                scale: new THREE.Vector3(brick.scale.x, brick.scale.y, brick.scale.z),
                color: "hsl(" + hue +", 100%, 50%)",
                direction: direction
            });
            direction = 'z';
            startPos = -startPos;
        }
        else if(direction == 'z') {
            var topBrick = new Brick({
                position: new THREE.Vector3(brick.position.x, 0, startPos),
                scale: new THREE.Vector3(brick.scale.x, brick.scale.y, brick.scale.z),
                color: "hsl(" + hue +", 100%, 50%)",
                direction: direction
            });
            direction = 'x';
        }

        // Menambahkan balok baru
        // Membuang balok lama
        scene.add(topBrick.build);
        scene.remove(bricks.front().build);
        bricks.pop();
        bricks.push(topBrick);

        hue = (hue + 5) % 360;
        command = PLAY;
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