const THREE = require('three');

class Brick {
    constructor(param = {}) {
        //===============
        //---Parameter---
        //===============
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

        // Melakukan assign dari parameter
        // ke default parameter agar nilai parameter
        // di dalam class berubah
        this.params = Object.assign(defaultParam, param);
        
        this.geometry = new THREE.BoxGeometry(this.params.edge.x, this.params.edge.y, this.params.edge.z);
        this.material = new THREE.MeshLambertMaterial( { color: this.params.color } );
        
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.castShadow = this.params.castShadow;
        this.mesh.receiveShadow = this.params.receiveShadow;
        this.mesh.position.copy(this.params.position);
    }

    // Karena scene me-render mesh,
    // agar lebih mudah memanggilnya dibuat fungsi saja
    build() {
        return this.mesh;
    }

    position() {
        return this.mesh.position;
    }

    // Melakukan move object sesuai arah
    // pada sumbu cartesian 'x' dan 'z'
    move() {
        const batas = 6.5;

        switch (this.params.direction) {
            case 'x':
                if(this.mesh.position.x >= batas || this.mesh.position.x <= -batas)
                    this.params.speed = -this.params.speed;
                    
                if(this.mesh.position.x >= batas)
                    this.mesh.position.x = batas;
                else if(this.mesh.position.x <= -batas)
                    this.mesh.position.x = -batas;
                
                this.mesh.position.x += this.params.speed;
                break;
            case 'z':
                if(this.mesh.position.z >= batas || this.mesh.position.z <= -batas)
                    this.params.speed = -this.params.speed;
                    
                if(this.mesh.position.z >= batas)
                    this.mesh.position.z = batas;
                else if(this.mesh.position.z <= -batas)
                    this.mesh.position.z = -batas;
                
                this.mesh.position.z += this.params.speed;
                break;
            default:
                break;
        }
    }

}

module.exports = Brick;