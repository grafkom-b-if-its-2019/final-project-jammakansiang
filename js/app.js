const THREE = require('three');
const Scene = require('./scene');
const Brick = require('./brick');
const Queue = require('./queue');

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
let command, direction = 'x';

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

    switch (command) {
        case SPACE:
            brick.params.speed = 0;
            bricks.set(brick);

            for(let i = 0;i < bricks.size(); i++)
                bricks.items[i].position().y -= 1;
            
            var topBrick = new Brick({
                direction: direction
            });
            scene.add(topBrick.build());
            scene.remove(bricks.front().build());
            
            console.log(scene.scene.children);
            bricks.pop();
            bricks.push(topBrick);

            if(direction == 'x')
                direction = 'z';
            else if(direction == 'z')
                direction = 'x';

            command = PLAY;
            break;
    
        default:
            break;
    }

    scene.render();
}

//===================
//---Event Handler---
//===================
function onKeyDown(event) {
    switch (event.code) {
        case "Space":
            command = SPACE;
            break;
        
        default:
            break;
    }
}

window.addEventListener('keydown', onKeyDown);
animate();