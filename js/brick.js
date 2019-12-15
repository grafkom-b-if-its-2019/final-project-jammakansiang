const THREE = require('three');
const Physijs = require('physijs-webpack/browserify');

class Brick {
    static speed = 0.07;

    constructor(param = {}) {
        //===============
        //---Parameter---
        //===============
        var perfect = document.getElementById("perfect");
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
        this.speed = Brick.speed;

        this.geometry = new THREE.BoxGeometry(this.params.size.x, this.params.size.y, this.params.size.z);
        this.material = new THREE.MeshLambertMaterial( { color: this.params.color } );
        
        // Physics mesh
        this.physijs_material = Physijs.createMaterial(
            this.material,
            .7, // gaya gesek
            .5 // gaya mantul
        );
        this.physijs_box = new Physijs.BoxMesh(
            this.geometry,
            this.physijs_material,
            0
        );
        this.physijs_box.collisions = 0;
        this.physijs_box.setAngularVelocity(new THREE.Vector3(0, 0, 0));
        this.physijs_box.setLinearVelocity(new THREE.Vector3(0, 0, 0));
        this.physijs_box.name = this.physijs_box.uuid;
        this.physijs_box.castShadow = this.params.castShadow;
        this.physijs_box.receiveShadow = this.params.receiveShadow;
        this.physijs_box.position.copy(this.params.position);
        this.physijs_box.scale.copy(this.params.scale);
        // this.physijs_box.__dirtyPosition = true;
        // this.physijs_box.__dirtyRotation = true;

        // this.mesh = new THREE.Mesh( this.geometry, this.material );
        // this.mesh.name = this.mesh.uuid;
        // this.mesh.castShadow = this.params.castShadow;
        // this.mesh.receiveShadow = this.params.receiveShadow;
        // this.mesh.position.copy(this.params.position);
        // this.mesh.scale.copy(this.params.scale);
    }

    static increaseSpeed() {
        Brick.speed += 0.001;
        this.speed = Brick.speed;
    }

    static resetSpeed() {
        Brick.speed = 0.07;
    }

    // Karena scene me-render mesh,
    // agar lebih mudah memanggilnya dibuat fungsi saja
    get build() {
        //return this.mesh;
        return this.physijs_box;
    }

    get color() {
    //     return this.material.color.getHSL();
        return this.physijs_material.color.getHSL();
    }

    /**
     * @param {THREE.Color} newColor
     */
    set color(newColor) {
        this.material.color.set(newColor);
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
        this.physijs_box.__dirtyPosition = true
        this.physijs_box.position.y -= 1;
    }

    // menghilangkan seluruh mass untuk dapat efek jatuh ketika mutlak kalah
    disabledMass() {
        Brick.physijs_box = new Physijs.BoxMesh(
            this.geometry,
            this.physijs_material
        );
        Brick.physijs_box.__dirtyPosition = false;
    }

    /**
     * @param {Brick} prevBrick Balok sebagai perbandingan saat ini dengan sebelumnya
     * @returns {boolean} Kondisi apakah dia masih bisa memotong atau tidak
     */
    cut(prevBrick)
    {
        console.log(this.color);
        var mantap = false;
        var prevPosition = prevBrick.position;
        prevPosition.x = Number((prevPosition.x).toFixed(1));
        prevPosition.y = Number((prevPosition.y).toFixed(1));
        prevPosition.z = Number((prevPosition.z).toFixed(1));
       
        var curScale = this.scale;
        curScale.x = Number((curScale.x).toFixed(1));
        curScale.y = Number((curScale.y).toFixed(1));
        curScale.z = Number((curScale.z).toFixed(1));
        
        var curPosition = this.position;
        curPosition.x = Number((curPosition.x).toFixed(1));
        curPosition.y = Number((curPosition.y).toFixed(1));
        curPosition.z = Number((curPosition.z).toFixed(1));
        
        var diffX = curPosition.x - prevPosition.x;
        var diffZ = curPosition.z - prevPosition.z;

        // console.log("x : " + diffX, curScale.x);
        // console.log("Z : " + diffZ, curScale.z);

        if(diffX==0 && diffZ==0){
            perfect.style.opacity = 1.0;
            mantap = true;
        }

        // Jika ukuran saat ini lebih kecil
        // dari potongannya, maka error / gameover (return false)
        if(curScale.x < Math.abs(diffX) 
        || curScale.z < Math.abs(diffZ) ) {
            this.disabledMass();
            Brick.resetSpeed();
            return [false, prevPosition, curScale, curPosition, this.color, mantap];
        }
            
        curScale.x -= Math.abs(diffX);
        curPosition.x -= (diffX/2);
        curScale.z -= Math.abs(diffZ);
        curPosition.z -= (diffZ/2);

        Brick.increaseSpeed();
        this.scale.copy(curScale);
        return [true, prevPosition, curScale, curPosition, this.color, mantap];
    }

    /** 
     * Melakukan move object sesuai arah
     * pada sumbu cartesian 'x' dan 'z'
     */
    move() {
        if(perfect.style.opacity>0){
            perfect.style.opacity-=0.03;
        }
        const batas = 6.5;

        // console.log("x : " + this.position.x);
        // console.log("Z : " + this.position.y);

        switch (this.params.direction) {
            // Jika bergerak di-sumbu 'x'
            case 'x':
                // if(this.mesh.position.x >= batas || this.mesh.position.x <= -batas)
                if(this.physijs_box.position.x >= batas || this.physijs_box.position.x <= -batas)
                    this.speed = -this.speed;
                    
                // if(this.mesh.position.x >= batas)
                if(this.physijs_box.position.x >= batas)
                    this.position.x = batas;
                    // this.mesh.position.x = batas;
                // else if(this.mesh.position.x <= -batas)
                else if(this.physijs_box.position.x <= -batas)
                    this.position.x = -batas;
                    // this.mesh.position.x = -batas;
                
                // this.mesh.position.x += this.speed;
                this.physijs_box.position.x += this.speed;
                break;
            // Jika bergerak di-sumbu 'z'
            case 'z':
                // if(this.mesh.position.z >= batas || this.mesh.position.z <= -batas)
                if(this.physijs_box.position.z >= batas || this.physijs_box.position.z <= -batas)
                    this.speed = -this.speed;
                    
                // if(this.mesh.position.z >= batas)
                if(this.physijs_box.position.z >= batas)
                    this.position.z = batas;
                    // this.mesh.position.z = batas;
                // else if(this.mesh.position.z <= -batas)
                else if(this.physijs_box.position.z <= -batas)
                    this.position.z = -batas;
                    // this.mesh.position.z = -batas;
                
                // this.mesh.position.z += this.speed;
                this.physijs_box.position.z += this.speed;
                break;
            default:
                break;
        }
    }

}

module.exports = Brick;
