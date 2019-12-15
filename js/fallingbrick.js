const THREE = require('three');
const Physijs = require('physijs-webpack/browserify');

class FallingBrick {
    static speed = 0.07;

    constructor(param = {}) {
        //===============
        //---Parameter---
        //===============
        var defaultParam = {
            size: new THREE.Vector3(1, 1, 1),
            position: new THREE.Vector3(0, 0, 0),
            scale: new THREE.Vector3(5, 1, 5),
            castShadow: true,
            receiveShadow: true,
            color: "hsl(220, 100%, 50%)",
            direction: 'x',
        }

        // Melakukan assign dari parameter
        // ke default parameter agar nilai parameter
        // di dalam class berubah
        this.params = Object.assign(defaultParam, param);
        this.speed = FallingBrick.speed;

        this.geometry = new THREE.BoxGeometry(this.params.size.x, this.params.size.y, this.params.size.z);
        this.material = new THREE.MeshLambertMaterial( { color: this.params.color } );
        
        // Physics mesh
        this.physijs_material = Physijs.createMaterial(
            this.material,
            .7,
            .3
        );
        this.physijs_box = new Physijs.BoxMesh(
            this.geometry,
            this.physijs_material
        );
        this.physijs_box.collisions = 0;
        this.physijs_box.name = this.physijs_box.uuid;
        this.physijs_box.castShadow = this.params.castShadow;
        this.physijs_box.receiveShadow = this.params.receiveShadow;
        this.physijs_box.position.copy(this.params.position);
        this.physijs_box.scale.copy(this.params.scale);
        console.log(this.physijs_box);

        // this.mesh = new THREE.Mesh( this.geometry, this.material );
        // this.mesh.name = this.mesh.uuid;
        // this.mesh.castShadow = this.params.castShadow;
        // this.mesh.receiveShadow = this.params.receiveShadow;
        // this.mesh.position.copy(this.params.position);
        // this.mesh.scale.copy(this.params.scale);
    }

    static increaseSpeed() {
        FallingBrick.speed += 0.001;
        this.speed = FallingBrick.speed;
    }

    static resetSpeed() {
        FallingBrick.speed = 0.07;
    }

    // Karena scene me-render mesh,
    // agar lebih mudah memanggilnya dibuat fungsi saja
    get build() {
        // return this.mesh;
        return this.physijs_box;
    }

    get name() {
        // return this.mesh.name;
        return this.physijs_box.name;
    }

    get position() {
        // return this.mesh.position;
        return this.physijs_box.position;
    }

    /**
     * @param {THREE.Vector3} newPosition
     */
    set position(newPosition) {
        this.position.copy(newPosition);
    }

    get scale() {
        // return this.mesh.scale;
        return this.physijs_box.scale;
    }

    /**
     * @param {THREE.Vector3} newScale
     */
    set scale(newScale) {
        this.scale.copy(newScale);
    }

    down() {
        // this.mesh.position.y -= 1;
        this.physijs_box.position.y -= 1;
    }

    /**
     * @param {Brick} prevBrick Balok sebagai perbandingan saat ini dengan sebelumnya
     * @returns {boolean} Kondisi apakah dia masih bisa memotong atau tidak
     */
    cut(prevBrick)
    {
        var prevPosition = prevBrick.position;
        var curScale = this.scale;
        var curPosition = this.position;
        
        var diffX = curPosition.x - prevPosition.x;
        var diffZ = curPosition.z - prevPosition.z;

        console.log("x : " + diffX, curScale.x);
        console.log("Z : " + diffZ, curScale.z);

        // Jika ukuran saat ini lebih kecil
        // dari potongannya, maka error / gameover (return false)
        if(curScale.x < Math.abs(diffX) 
        || curScale.z < Math.abs(diffZ) ) {
            FallingBrick.resetSpeed();
            return false;
        }
            
        curScale.x -= Math.abs(diffX);
        curPosition.x -= (diffX/2);
        curScale.z -= Math.abs(diffZ);
        curPosition.z -= (diffZ/2);

        FallingBrick.increaseSpeed();
        this.scale.copy(curScale);
        return true;
    }

    /** 
     * Melakukan move object sesuai arah
     * pada sumbu cartesian 'x' dan 'z'
     */
    move() {
        const batas = 6.5;

        switch (this.params.direction) {
            // Jika bergerak di-sumbu 'x'
            case 'x':
                if(this.position.x >= batas || this.position.x <= -batas)
                    this.speed = -this.speed;
                    
                if(this.position.x >= batas)
                    this.position.x = batas;
                else if(this.position.x <= -batas)
                    this.position.x = -batas;
                
                // this.position.x += this.speed;
                this.physijs_box.position.x += this.speed;
                break;
            // Jika bergerak di-sumbu 'z'
            case 'z':
                if(this.position.z >= batas || this.position.z <= -batas)
                    this.speed = -this.speed;
                    
                if(this.position.z >= batas)
                    this.position.z = batas;
                else if(this.position.z <= -batas)
                    this.position.z = -batas;
                
                // this.mesh.position.z += this.speed;
                this.physijs_box.position.z += this.speed;
                break;
            default:
                break;
        }
    }

}

module.exports = FallingBrick;