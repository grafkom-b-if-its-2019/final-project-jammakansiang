const THREE = require('three');
const Brick = require('./brick');
const Scene = require('./scene');

var scene = new Scene();
var brick = new Brick();
scene.add(brick.mesh);
scene.animate();