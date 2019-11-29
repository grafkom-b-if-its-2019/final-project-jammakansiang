const THREE = require('three');
const OrbitControls = require('three-orbitcontrols');

class Scene {
    constructor(param = {}) {
        this.params = Object.assign(Scene.default, param);
        
        //===============
        //-----Scene-----
        //===============
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x162d47, 50, 300);
        
        //==================
        //-----Renderer-----
        //==================
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild( this.renderer.domElement );

        //================
        //-----Camera-----
        //================
        const cameraConfig = this.params.camera;
        const aspect = Window.innerWidth / Window.innerHeight;
        const depth = cameraConfig.depth;
        const viewSize = 64;
        // this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        // this.camera.position.y = 1;
        // this.camera.position.z = 5;
        
        this.camera = new THREE.OrthographicCamera(depth * aspect / -2, depth * aspect / 2, depth / 2, depth / -2, cameraConfig.near, cameraConfig.far);
        this.camera.position.copy(cameraConfig.position);
        this.camera.lookAt(new THREE.Vector3().fromArray(cameraConfig.lookAt));
        
        this.camera.left = window.innerWidth / - viewSize;
        this.camera.right = window.innerWidth / viewSize;
        this.camera.top = window.innerHeight / viewSize;
        this.camera.bottom = window.innerHeight / - viewSize;
        this.camera.updateProjectionMatrix();

        console.log(this.camera);
        // var cameraHelper = new THREE.CameraHelper(this.camera);
        // this.add(cameraHelper);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
       

        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 10, 10, 10 );
        this.scene.add( spotLight );
        
        var spotLightHelper = new THREE.SpotLightHelper( spotLight );
        this.scene.add( spotLightHelper );
    }

    add(object) {
        this.scene.add(object);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

Scene.default = {
    camera: {
        depth: 300,
        near: -50,
        far: 1000,
        position: new THREE.Vector3(2, 2, 2),
        lookAt: [0, 0, 0],    
    }
}

module.exports = Scene;