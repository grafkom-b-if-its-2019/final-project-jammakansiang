const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');

class Scene {
    constructor(param = {}) {
        //===============
        //---Parameter---
        //===============
        var defaultParam = {
            camera: {
                depth: 64,
                near: -50,
                far: 1000,
                position: new THREE.Vector3(2, 2, 2),
                lookAt: [0, 0, 0],    
            }
        };
        this.params = Object.assign(defaultParam, param);
        
        //===============
        //-----Scene-----
        //===============
        this.scene = new THREE.Scene();
        
        //==================
        //-----Renderer-----
        //==================
        const canvas = document.querySelector('#c');
        this.renderer = new THREE.WebGLRenderer({canvas, alpha:true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        //================
        //-----Camera-----
        //================
        const cameraConfig = this.params.camera;
        const depth = cameraConfig.depth;
        const frustumSize = 64;
        // this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        // this.camera.position.y = 1;
        // this.camera.position.z = 5;
        
        this.camera = new THREE.OrthographicCamera(depth / -2, depth / 2, depth / 2, depth / -2, cameraConfig.near, cameraConfig.far);
        this.camera.position.copy(cameraConfig.position);
        this.camera.lookAt(new THREE.Vector3().fromArray(cameraConfig.lookAt));
        
        this.camera.left = window.innerWidth / - frustumSize;
        this.camera.right = window.innerWidth / frustumSize;
        this.camera.top = window.innerHeight / frustumSize;
        this.camera.bottom = window.innerHeight / - frustumSize;
        this.camera.updateProjectionMatrix();

        // var cameraHelper = new THREE.CameraHelper(this.camera);
        // this.add(cameraHelper);
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
       
        //===============
        //-----Light-----
        //===============
        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 8, 10, 10 );
        this.scene.add( spotLight );

        var spotLight1 = new THREE.SpotLight( 0x444444 );
        spotLight1.position.set( -8, -10, -10 );
        this.scene.add( spotLight1 );
        
        // var spotLightHelper = new THREE.SpotLightHelper( spotLight );
        // this.scene.add( spotLightHelper );

        addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * 
     * @param {THREE.Object3D} object 
     */
    add(object) {
        this.scene.add(object);
    }

    /**
     * 
     * @param {String} object Name dari THREE.Object3D 
     */
    remove(objectName) {
        var selectedObject = this.scene.getObjectByName(objectName);
        this.scene.remove(selectedObject);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const frustumSize = 64;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.camera.left = window.innerWidth / - frustumSize;
        this.camera.right = window.innerWidth / frustumSize;
        this.camera.top = window.innerHeight / frustumSize;
        this.camera.bottom = window.innerHeight / - frustumSize;
        this.camera.updateProjectionMatrix();
    }
}

module.exports = Scene;