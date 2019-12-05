const THREE = require('three');
const Scene = require('./scene');
const Brick = require('./brick');
const Queue = require('./queue');
const socket = require('socket.io-client')(window.location.host);

//==================
//--Define command--
//==================
const SPACE = 0;
const PAUSE = 1;
const PLAY = 2;

//==================
//---Inisialisasi---
//==================
var scene = new Scene();
let bricks = new Queue();
let brick = new Brick();
let command, startPos = 6.5, direction = 'z';
let scale = new THREE.Vector3();
let position = new THREE.Vector3();
let hue = 220;

for(let i = -15;i <= 1; i++) {
    brick = new Brick({
        position: new THREE.Vector3(0, -1 + i, 0),
        direction: 'z'
    });

    bricks.push(brick);
    scene.add(brick.build());
}

//=======================
//--Algoritma permainan--
//=======================
function animate() {
    requestAnimationFrame(() => {animate()});
    brick = bricks.back();
    brick.move();

    socket.on('sendCoords', function(data) {
        console.log(data);
    });

    if(command == SPACE) {
        prevBrick = bricks.get(bricks.size() - 2);
        brick.stop();
        brick.cut(prevBrick);

        bricks.set(brick);

        // Untuk setiap stepnya, balok yang lama turun 1 kotak
        for(let i = 0;i < bricks.size(); i++)
            bricks.items[i].down();

        if(direction == 'x') {
            var topBrick = new Brick({
                position: new THREE.Vector3(-startPos, 0, brick.position().z),
                scale: new THREE.Vector3(brick.scale().x, brick.scale().y, brick.scale().z),
                color: "hsl(" + hue +", 100%, 50%)",
                direction: direction
            });
            direction = 'z';
            startPos = -startPos;
        }
        else if(direction == 'z') {
            var topBrick = new Brick({
                position: new THREE.Vector3(brick.position().x, 0, startPos),
                scale: new THREE.Vector3(brick.scale().x, brick.scale().y, brick.scale().z),
                color: "hsl(" + hue +", 100%, 50%)",
                direction: direction
            });
            direction = 'x';
        }

        // Menambahkan balok baru
        // Membuang balok lama
        scene.add(topBrick.build());
        scene.remove(bricks.front().build());
        bricks.pop();
        bricks.push(topBrick);

        hue = (hue + 5) % 360;
        command = PLAY;
    }

    scene.render();
}

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
animate();