const THREE = require('three');

class Brick {
    constructor() {
        var geometry = new THREE.BoxGeometry( 3, 1, 1 );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.mesh = new THREE.Mesh( geometry, material );
    }
}

module.exports = Brick;