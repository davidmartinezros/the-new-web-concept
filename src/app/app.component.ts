import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CubeGeometry, Scene, PointLight, PerspectiveCamera, Vector3, BoxBufferGeometry, MeshBasicMaterial, Mesh, WebGLRenderer, PCFSoftShadowMap, Color, DoubleSide, Vector2, Geometry, Face3, Raycaster, ShaderMaterial, LineSegments, Box3, Ray, BoxGeometry, Matrix4, Matrix3, Line3, Line, AmbientLight, DirectionalLight, PlaneGeometry, LineBasicMaterial, CylinderGeometry, Material } from 'three';
//import "./js/EnableThreeExamples";
//import "three/examples/js/controls/OrbitControls";
import { Cube } from './cube';
import { Camera } from './camera';

declare var THREE;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  scene: Scene;

	cssScene: Scene;

  camera: Camera;

  renderer: WebGLRenderer;

  rendererCSS: THREE.CSS3DRenderer;

  controls: THREE.OrbitControls;

  cubes: Array<Cube>;

  lines: Array<Line>;

  colors: Array<Color>;

  @ViewChild('canvas') private canvasRef: ElementRef;

  @ViewChild('canvasHtml') private canvasRefHtml: ElementRef;

  constructor() {
    this.render = this.render.bind(this);
    this.renderControls = this.renderControls.bind(this);
    this.cubes = new Array();
    this.lines = new Array();
    this.colorsPalette();
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private get canvasHtml(): HTMLCanvasElement {
    return this.canvasRefHtml.nativeElement;
  }

  ngOnInit() {
    this.scene = new Scene();

    this.cssScene = new Scene();

    this.create3dPage(
      900, 1000,
      new THREE.Vector3(0, 0, 50),
      new THREE.Vector3(0, 0, 50),
      'http://adndevblog.typepad.com/cloud_and_mobile');

    //this.loadPlane();

    //this.loadHtml();

    this.loadCubes();

    //this.loadLines();
    
    this.createCamera();

    this.createLights();

    this.startRendering();

    this.addControls();
  }

  private createCamera() {
    this.camera = new Camera();
    this.camera.camera = new PerspectiveCamera(55.0, (window.innerWidth / 2)/window.innerHeight, 0.5, 3000);
    this.camera.camera.position.set(75, 75, -75);
    this.camera.camera.lookAt(this.scene.position);
/*
    this.camera.cameraHtml = new PerspectiveCamera(55.0, (window.innerWidth / 2)/window.innerHeight, 0.5, 3000);
    this.camera.cameraHtml.position.set(0, 0, 300);
    this.camera.cameraHtml.lookAt(this.cssScene.position);
    console.log(this.cssScene.position)
 */
  }

  private createLights() {
    // Add 2 lights.
    var light1 = new PointLight(0x114440, 5, 0);
    light1.position.set(200, 200, -300);
    this.scene.add(light1);
    var light2 = new PointLight(0x444011, 5, 0);
    light2.position.set(-200, 200, -300);
    this.scene.add(light2);

    var light3 = new PointLight(0x114440, 5, 0);
    light3.position.set(200, 200, -300);
    this.cssScene.add(light3);
    var light4 = new PointLight(0x444011, 5, 0);
    light4.position.set(-200, 200, -300);
    this.cssScene.add(light4);
  }

  ///////////////////////////////////////////////////////////////////
  // Creates plane mesh
  //
  ///////////////////////////////////////////////////////////////////
  private createPlane(w, h, position, rotation) {
    var material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.0,
      side: THREE.DoubleSide
    });
    var geometry = new THREE.PlaneGeometry(w, h);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = position.x;
    mesh.position.y = position.y;
    mesh.position.z = position.z;
    mesh.rotation.x = rotation.x;
    mesh.rotation.y = rotation.y;
    mesh.rotation.z = rotation.z;
    return mesh;
  }

  ///////////////////////////////////////////////////////////////////
  // Creates CSS object
  //
  ///////////////////////////////////////////////////////////////////
  private createCssObject(w, h, position, rotation, url) {
    var html = [
      '<div style="width:' + w + 'px; height:' + h + 'px;">',
      '<iframe src="' + url + '" width="' + w + '" height="' + h + '">',
      '</iframe>',
      '</div>'
    ].join('\n');
    var div = document.createElement('div');
    div.innerHTML = html;
    var cssObject = new THREE.CSS3DObject(div);
    cssObject.position.x = position.x;
    cssObject.position.y = position.y;
    cssObject.position.z = position.z;
    cssObject.rotation.x = rotation.x;
    cssObject.rotation.y = rotation.y;
    cssObject.rotation.z = rotation.z;
    return cssObject;
  }

  ///////////////////////////////////////////////////////////////////
  // Creates 3d webpage object
  //
  ///////////////////////////////////////////////////////////////////
  private create3dPage(w, h, position, rotation, url) {
    var plane = this.createPlane(
      w, h,
      position,
      rotation);
    this.scene.add(plane);
    var cssObject = this.createCssObject(
        w, h,
        position,
        rotation,
        url);
    this.cssScene.add(cssObject);
  }

  private loadHtml() {
  /*
    // create the plane mesh
    var material = new THREE.MeshBasicMaterial({ wireframe: true });
    var planeWidth = 360;
    var planeHeight = 120;
	  var geometry = new THREE.PlaneGeometry( planeWidth, planeHeight );
    var planeMesh= new THREE.Mesh( geometry, material );
    // add it to the WebGL scene
    this.scene.add(planeMesh);
*/
    // create the dom Element
    var element = document.createElement( 'iframe' );
    element.src = 'https://www.google.es/';
    // width of iframe in pixels
    var elementWidth = 500;
    // force iframe to have same relative dimensions as planeGeometry
    var aspectRatio = (window.innerWidth/2) / window.innerHeight;
    var elementHeight = elementWidth * aspectRatio;
    element.style.width  = elementWidth + "px";
    element.style.height = elementHeight + "px";
    element.style.backgroundColor = "white";

    // create the object3d for this element
    var cssObject = new THREE.CSS3DObject( element );
    
    cssObject.position.x = 0;
    cssObject.position.y = 0;
    cssObject.position.z = 0;
/*
    cssObject.rotation.x = planeMesh.rotation.x;
    cssObject.rotation.y = planeMesh.rotation.z;
    cssObject.rotation.z = planeMesh.rotation.z;
*/
/*
    var percentBorder = 0.05;
    cssObject.scale.x /= (1 + percentBorder) * (elementWidth / planeWidth);
    cssObject.scale.y /= (1 + percentBorder) * (elementWidth / planeWidth);
    // we reference the same position and rotation 
    */
    console.log(cssObject);
    //cssObject.position = planeMesh.position;
    //cssObject.rotation = planeMesh.rotation;
    // add it to the css scene
    this.cssScene.add(cssObject);
  }

  private loadPlane() {
    let geometry = new PlaneGeometry(1000, 1000, 1, 1);
    
    // Make a material
    var material = new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0xffffff,
      shininess: 50,
      flatShading: THREE.SmoothShading
    });
    let plane = new Mesh(geometry, material);
    this.scene.add(plane);
  }

  private loadCube() {
    let cube = new Cube();
    this.createCube(cube, 10, 0, 0, 0);
  }

  private loadCubes() {
    /*
    let geometry = new BoxGeometry(12, 50, 12, 1, 1, 1);
    
    var material = new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0xffffff,
      shininess: 50,
      flatShading: THREE.SmoothShading,
      transparent: true,
      opacity: 0.25
    });

    let mesh = new Mesh(geometry, material);
    mesh.translateX(0);
    mesh.translateY(-6);
    mesh.translateZ(0);
    this.scene.add(mesh);
    */
    for(let x = 0; x < 5; x++) {
      for(let y = 0; y < 5; y++) {
        for(let z = 0; z < 5; z++) {
          let cube = new Cube();
          let translateX = -25 + 12.5*x;
          let translateY = -25 + 12.5*y;
          let translateZ = -25 + 12.5*z;
          cube.mesh = this.createCube(cube, 10, translateX, translateY, translateZ, true, 0.25);
          cube.mesh2 = this.createCube(cube, 3, translateX, translateY, translateZ, false);
          cube.cilindre1 = this.createCilindre(cube, 1, 1, 10, translateX, translateY, translateZ, false, false, false);
          cube.cilindre2 = this.createCilindre(cube, 2, 1, 10, translateX, translateY, translateZ, true, false, false);
          cube.cilindre3 = this.createCilindre(cube, 3, 1, 10, translateX, translateY, translateZ, false, false, true);
          cube.stopRotate = false;
          cube.stopTranslate = false;
          cube.changed = false;
          cube.dfTranslateX = translateX;
          cube.dfTranslateY = translateY;
          cube.dfTranslateZ = translateZ;
          this.cubes.push(cube);
        }
      }
    }
  }

  private loadCubesRandom() {
    for(let x = 0; x < 40; x++) {
      let cube = new Cube();
      this.createCube(cube, Math.random()*10, Math.random()*100-50, Math.random()*100-50, Math.random()*100-50);
    }
  }

  moveCubes() {
    for(let cube of this.cubes) {
      if(cube.mesh) {
        if(!cube.dfRotateX) {
          cube.dfRotateX = Math.random()-0.5;
        }
        if(!cube.dfRotateY) {
          cube.dfRotateY = Math.random()-0.5;
        }
        if(!cube.dfRotateZ) {
          cube.dfRotateZ = Math.random()-0.5;
        }
        if(!cube.dfTranslateX) {
          cube.dfTranslateX = Math.random()-0.5;
        }
        if(!cube.dfTranslateY) {
          cube.dfTranslateY = Math.random()-0.5;
        }
        if(!cube.dfTranslateZ) {
          cube.dfTranslateZ = Math.random()-0.5;
        }
        
        if(cube.stopRotate == false) {
          //console.log("aa:" + cube.stopRotate);
          cube.mesh.rotateX(cube.dfRotateX/30);
          cube.mesh.rotateY(cube.dfRotateY/30);
          cube.mesh.rotateZ(cube.dfRotateZ/30);
        }
        if(cube.stopTranslate == false) {
          //console.log("aa:" + cube.stopTranslate);
          cube.mesh.translateX(cube.dfTranslateX/10);
          cube.mesh.translateY(cube.dfTranslateY/10);
          cube.mesh.translateZ(cube.dfTranslateZ/10);
        }
        //console.log(this.cubes[x].totalRotateX);
      }
    }
  }

  private createCilindre(cube, number, radius, size, translateX, translateY, translateZ, rotateX, rotateY, rotateZ) {

    let geometry = new CylinderGeometry(radius, radius, size, size, 1);

    // Make a material
    var material = new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0xffffff,
      shininess: 50,
      flatShading: THREE.SmoothShading      
    });
    /*
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3( -translateX, translateY, -translateZ ),
      new THREE.Vector3( translateX, translateY, translateZ )
    );
    */
    let mesh = new Mesh(geometry, material);
    mesh.translateX(translateX);
    mesh.translateY(translateY);
    mesh.translateZ(translateZ);
    if(rotateX) {
      mesh.rotateX(Math.PI/2);
    }
    if(rotateY) {
      mesh.rotateY(Math.PI/2);
    }
    if(rotateZ) {
      mesh.rotateZ(Math.PI/2);
    }
    this.scene.add(mesh);
    
    return mesh;
  }

  private createCube(cube, size, translateX, translateY, translateZ, transparent?, opacity?) {
    let geometry = new BoxGeometry(size, size, size, 1, 1, 1);
    
    // Make a material
    var material = new THREE.MeshPhongMaterial({
      color: 0x555555,
      specular: 0xffffff,
      shininess: 50,
      flatShading: THREE.SmoothShading      
    });

    if(transparent) {
      material.transparent = true;
      //material.premultipliedAlpha = true;
      material.opacity = opacity;
    }

    let mesh = new Mesh(geometry, material);
    //mesh.rotateY(Math.PI/4);
    mesh.translateX(translateX);
    mesh.translateY(translateY);
    mesh.translateZ(translateZ);
    this.scene.add(mesh);

    return mesh;
  }

  private colorsPalette() {
    this.colors = new Array();
    this.colors.push(new Color(0, 255, 255));
    this.colors.push(new Color(255, 0, 230));
    this.colors.push(new Color(205, 255, 0));
  }

  public render() {
    //console.log("render");

    //this.moveCubes();

    //this.moveCamera();

    this.renderer.render( this.scene, this.camera.camera );

    this.rendererCSS.render( this.cssScene, this.camera.camera );

    requestAnimationFrame(this.render);

  }

  renderControls() {
    this.renderer.render( this.scene, this.camera.camera );

    this.rendererCSS.render( this.cssScene, this.camera.camera );
  }

  public addControls() {
      this.controls = new THREE.OrbitControls(this.camera.camera);
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.addEventListener('change', this.renderControls);
  }

  private startRendering() {
    /*
    this.renderer = new THREE.CSS3DRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0px';
    */
    this.renderer = this.createGlRenderer();

    console.log(this.canvas);

    console.log(this.canvasHtml);

    // create a renderer for CSS
    this.rendererCSS	= this.createCssRenderer();

    document.body.appendChild(this.rendererCSS.domElement);
    this.rendererCSS.domElement.appendChild(this.renderer.domElement);

    //this.rendererCSS.domElement.appendChild(glRenderer.domElement);
    
    //document.body.appendChild( this.rendererCSS.domElement );
/*
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top      = '0px';
    // make sure original renderer appears on top of CSS renderer
    this.renderer.domElement.style.zIndex   = '1';
    //this.rendererCSS.domElement.appendChild( this.renderer.domElement );
  */  
    this.render();
  }

  ///////////////////////////////////////////////////////////////////
  // Creates WebGL Renderer
  //
  ///////////////////////////////////////////////////////////////////
  private createGlRenderer() {
    var glRenderer = new THREE.WebGLRenderer({
      canvas: this.canvas, 
      antialias: true, 
      alpha:true});
    glRenderer.setClearColor(0xECF8FF);
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    glRenderer.domElement.style.position = 'absolute';
    glRenderer.domElement.style.zIndex = 1;
    glRenderer.domElement.style.top = 0;
    return glRenderer;
  }
  ///////////////////////////////////////////////////////////////////
  // Creates CSS Renderer
  //
  ///////////////////////////////////////////////////////////////////
  private createCssRenderer() {
    var cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.zIndex = 0;
    cssRenderer.domElement.style.top = 0;
    return cssRenderer;
  }

  public onMouseMove(event: MouseEvent) {
    console.log("onMouse");
  }

  public onMouseDown(event: MouseEvent) {
    console.log("onMouseDown");
    event.preventDefault();

    // Example of mesh selection/pick:
    var raycaster = new Raycaster();
    var mouse = new Vector2();
    mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, this.camera.camera);

    for(let cube of this.cubes) {
      (<Material>cube.mesh.material).transparent = true;
      (<Material>cube.mesh.material).opacity = 0.25;
    }

    var obj: THREE.Object3D[] = [];
    this.findAllObjects(obj, this.scene);
    var intersects = raycaster.intersectObjects(obj);
    console.log("Scene has " + obj.length + " objects");
    console.log(intersects.length + " intersected objects found")
    if(intersects.length > 0) {
        //console.log(i.object); // do what you want to do with object
        //i.object.position.y = i.object.position.y + 1;
        let cubesTmp: Cube[];
        cubesTmp = this.cubes.filter(cube => cube.mesh === intersects[0].object)
        if(cubesTmp.length > 0) {
          //console.log(cubesTmp[0].stopTranslate);
          if(!cubesTmp[0].changed) {
            cubesTmp[0].stopTranslate = !cubesTmp[0].stopTranslate;
            cubesTmp[0].stopRotate = !cubesTmp[0].stopRotate;
            cubesTmp[0].changed = true;
            (<Material>cubesTmp[0].mesh.material).transparent = false;
            (<Material>cubesTmp[0].mesh.material).opacity = 1.0;
            for(let cube of this.cubes) {
              if(cube.mesh != cubesTmp[0].mesh) {
                if(cube.dfTranslateX == cubesTmp[0].dfTranslateX
                  && cube.dfTranslateY == cubesTmp[0].dfTranslateY) {
                  (<Material>cube.mesh.material).opacity = 0.6;
                }
                if(cube.dfTranslateX == cubesTmp[0].dfTranslateX
                  && cube.dfTranslateZ == cubesTmp[0].dfTranslateZ) {
                  (<Material>cube.mesh.material).opacity = 0.6;
                }
                if(cube.dfTranslateY == cubesTmp[0].dfTranslateY
                  && cube.dfTranslateZ == cubesTmp[0].dfTranslateZ) {
                  (<Material>cube.mesh.material).opacity = 0.6;
                }
              }
            }
            //console.log(cubesTmp[0].stopTranslate);
          }
        }
    }
    this.setAllChangedsToFalse();
    this.renderControls();
  }

  private setAllChangedsToFalse() {
    for(let cube of this.cubes) {
      cube.changed = false;
    }
  }

  private findAllObjects(pred: THREE.Object3D[], parent: THREE.Object3D) {
      // NOTE: Better to keep separate array of selected objects
      if (parent.children.length > 0) {
          parent.children.forEach((i) => {
              pred.push(i);
              this.findAllObjects(pred, i);                
          });
      }
  }
  
  public onMouseUp(event: MouseEvent) {
      console.log("onMouseUp");
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {

      console.log("onResize: " + (window.innerWidth - 2)/2 + ", "  + (window.innerHeight - 6));

      this.camera.camera.aspect = this.getAspectRatio();
      this.camera.camera.updateProjectionMatrix();
      this.renderer.setSize((window.innerWidth - 2)/2, window.innerHeight - 6);
      this.rendererCSS.setSize((window.innerWidth - 2)/2, window.innerHeight - 6);
      this.render();
  }

  @HostListener('document:keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
      console.log("onKeyPress: " + event.key);
  }

  private getAspectRatio(): number {
    let height = this.canvas.clientHeight;
    if (height === 0) {
        return 0;
    }
    return (this.canvas.clientWidth/2) / this.canvas.clientHeight;
  }

}
