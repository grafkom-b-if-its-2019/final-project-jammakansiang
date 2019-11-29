const THREE = require('three');

class Brick {
    constructor(param = {}) {
        var defaultParam = {
            edge: new THREE.Vector3(5, 1, 5),
            position: new THREE.Vector3(0, 0, 0),
            castShadow: true,
            receiveShadow: true,
            color: 0x80FF70,
            scene: null,
            speed: 0.07,
            isDropped: false,
            direction: 'x',
        }

        this.params = Object.assign(defaultParam, param);
        
        var geometry = new THREE.BoxGeometry(this.params.edge.x, this.params.edge.y, this.params.edge.z);
        var material = new THREE.MeshLambertMaterial( { color: this.params.color } );
        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.castShadow = this.params.castShadow;
        this.mesh.receiveShadow = this.params.receiveShadow;
        this.mesh.position.copy(this.params.position);
        console.log(this.mesh.position);
    }

    build() {
        return this.mesh;
    }

    move() {
        const batas = 6.5;

        switch (this.params.direction) {
            case 'x':
                if(this.mesh.position.x >= batas || this.mesh.position.x <= -batas){
                    this.params.speed = -this.params.speed;
                }
                    
                if(this.mesh.position.x >= batas)
                    this.mesh.position.x = batas;
                else if(this.mesh.position.x <= -batas) {
                    this.mesh.position.x = -batas;
                }
                
                this.mesh.position.x += this.params.speed;
                break;
            case 'z':

                break;
            default:
                break;
        }
    }
}

module.exports = Brick;