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
            .7
        );
        this.physijs_box = new Physijs.BoxMesh(
            this.geometry,
            this.physijs_material
        );
        this.physijs_box.collisions = 0;
        this.physijs_box.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        this.physijs_box.setLinearVelocity(new THREE.Vector3(0, 0, 0));
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
        FallingBrick.speed += 0.1 * Math.random();
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
        this.physijs_box.__dirtyPosition = true;
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
        this.physijs_box.__dirtyPosition = true;
        this.physijs_box.position.y -= 1;
    }

    /**
     * @param {Brick} prevBrick Balok sebagai perbandingan saat ini dengan sebelumnya
     * @returns {boolean} Kondisi apakah dia masih bisa memotong atau tidak
     */

}

module.exports = FallingBrick;