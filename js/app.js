const THREE = require('three');
const Brick = require('./brick');
const Scene = require('./scene');

var scene = new Scene();
var stand = new Brick({
    position: new THREE.Vector3(0, -5, 0),
    edge: new THREE.Vector3(5, 9, 5),
});
var brick = new Brick();

scene.add(brick.build());
scene.add(stand.build());

function animate() {
    requestAnimationFrame(() => {animate()});
    
    brick.move();

    scene.render();
}

animate();