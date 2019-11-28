const THREE = require('three');

class Scene {
    constructor() {
        //===============
        //-----Scene-----
        //===============
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x162d47, 50, 300);
        
        //==================
        //-----Renderer-----
        //==================
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            // alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild( this.renderer.domElement );

        //================
        //-----Camera-----
        //================
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 5;
    }

    add(object) {
        this.scene.add(object);
    }

    animate() {
        requestAnimationFrame(() => {this.animate()});
        this.renderer.render(this.scene, this.camera);
    }
}

module.exports = Scene;