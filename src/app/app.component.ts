import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CubeGeometry, Scene, PointLight, PerspectiveCamera, Vector3, BoxBufferGeometry, MeshBasicMaterial, Mesh, WebGLRenderer, PCFSoftShadowMap, Color, DoubleSide, Vector2, Geometry, Face3, Raycaster, ShaderMaterial, LineSegments, Box3, Ray, BoxGeometry, Matrix4, Matrix3, Line3, Line, AmbientLight, DirectionalLight, PlaneGeometry, LineBasicMaterial } from 'three';
import "./js/EnableThreeExamples";
import "three/examples/js/controls/OrbitControls";
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

  camera: Camera;

  renderer: WebGLRenderer;

  controls: THREE.OrbitControls;

  cubes: Array<Cube>;

  lines: Array<Line>;

  colors: Array<Color>;

  @ViewChild('canvas') private canvasRef: ElementRef;

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

  ngOnInit() {
    this.scene = new Scene();

    this.loadPlane();

    this.loadCubes();

    //this.loadLines();
    
    this.createCamera();

    this.createLights();

    this.startRendering();

    this.addControls();
  }

  private createCamera() {
    this.camera = new Camera();
    this.camera.camera = new PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 3000);
    this.camera.camera.position.set(0, 25, -50);
    this.camera.camera.lookAt(new Vector3(0, 25, 0));
  }

  private createLights() {
    // Add 2 lights.
    var light1 = new PointLight(0x114440, 10, 0);
    light1.position.set(200, 100, -300);
    this.scene.add(light1);
    var light2 = new PointLight(0x444011, 10, 0);
    light2.position.set(-200, 100, -300);
    this.scene.add(light2);
  }

  private loadPlane() {
    let geometry = new PlaneGeometry(1000, 1000, 1, 1);
    
    // Make a material
    var material = new THREE.MeshPhongMaterial({
      ambient: 0x555555,
      color: 0x555555,
      specular: 0xffffff,
      shininess: 50,
      shading: THREE.SmoothShading
    });
    let plane = new Mesh(geometry, material);
    this.scene.add(plane);
  }

  private loadCube() {
    this.createCube(10, 0, 0, 0);
  }

  private loadCubes() {
    for(let x = 0; x < 4; x++) {
      this.createCube(10, 0, -25 + 12.5*x, 0, true);
      this.createCube(5, 0, -25 + 12.5*x, 0, false);
      this.createLine(3.5, -25 + 12.5*x, 3.5);
      this.createLine(3.5, -25 + 12.5*x, -3.5);
    }
  }

  private loadCubesRandom() {
    for(let x = 0; x < 40; x++) {
      this.createCube(Math.random()*10, Math.random()*100-50, Math.random()*100-50, Math.random()*100-50);
    }
  }

  moveCamera() {

    if(!this.camera.dfRotateX) {
      this.camera.dfRotateX = Math.random()-0.5;
    }
    if(!this.camera.dfRotateY) {
      this.camera.dfRotateY = Math.random()-0.5;
    }
    if(!this.camera.dfRotateZ) {
      this.camera.dfRotateZ = Math.random()-0.5;
    }
    if(!this.camera.dfTranslateX) {
      this.camera.dfTranslateX = Math.random()-0.5;
    }
    if(!this.camera.dfTranslateY) {
      this.camera.dfTranslateY = Math.random()-0.5;
    }
    if(!this.camera.dfTranslateZ) {
      this.camera.dfTranslateZ = Math.random()-0.5;
    }
    
    this.camera.camera.rotateX(this.camera.dfRotateX/30);
    this.camera.camera.rotateY(this.camera.dfRotateY/30);
    this.camera.camera.rotateZ(this.camera.dfRotateZ/30);

    //console.log(this.camera.dfRotateX);

    this.camera.camera.translateX(this.camera.dfTranslateX/10);
    this.camera.camera.translateY(this.camera.dfTranslateY/10);
    this.camera.camera.translateZ(this.camera.dfTranslateZ/10);

    //console.log(this.camera.dfTranslateX);
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

  private createLine(translateX, translateY, translateZ) {

    // Make a material
    var material = new THREE.MeshPhongMaterial({
      ambient: 0x555555,
      color: 0x555555,
      specular: 0xffffff,
      shininess: 50,
      shading: THREE.SmoothShading      
    });
    
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3( -translateX, translateY, -translateZ ),
      new THREE.Vector3( translateX, translateY, translateZ )
    );
    
    var line = new THREE.Line( geometry, material );
    this.scene.add( line );

    this.scene.add(line);
  }

  private createCube(size, translateX, translateY, translateZ, transparent?) {
    let geometry = new BoxGeometry(size, size, size, 1, 1, 1);
    
    // Make a material
    var material = new THREE.MeshPhongMaterial({
      ambient: 0x555555,
      color: 0x555555,
      specular: 0xffffff,
      shininess: 50,
      shading: THREE.SmoothShading      
    });

    if(transparent) {
      material.transparent = true;
      material.opacity = 0.5;
    }

    let mesh = new Mesh(geometry, material);
    mesh.rotateY(Math.PI/4);
    mesh.translateX(translateX);
    mesh.translateY(translateY);
    mesh.translateZ(translateZ);
    this.scene.add(mesh);

    let cube = new Cube();
    cube.mesh = mesh;
    cube.stopRotate = false;
    cube.stopTranslate = false;
    cube.changed = false;
    this.cubes.push(cube);
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

    this.renderer.render(this.scene, this.camera.camera);

    requestAnimationFrame(this.render);

  }

  renderControls() {
    this.renderer.render( this.scene, this.camera.camera );
  }

  public addControls() {
      this.controls = new THREE.OrbitControls(this.camera.camera);
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.addEventListener('change', this.renderControls);
  }

  private startRendering() {    
    this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize( window.innerWidth - 2, window.innerHeight - 6 );

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.autoClear = true;

    this.render();
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

    var obj: THREE.Object3D[] = [];
    this.findAllObjects(obj, this.scene);
    var intersects = raycaster.intersectObjects(obj);
    console.log("Scene has " + obj.length + " objects");
    console.log(intersects.length + " intersected objects found")
    intersects.forEach((i) => {
        //console.log(i.object); // do what you want to do with object
        //i.object.position.y = i.object.position.y + 1;
        let cubesTmp: Cube[];
        cubesTmp = this.cubes.filter(cube => cube.mesh === i.object)
        if(cubesTmp.length > 0) {
          //console.log(cubesTmp[0].stopTranslate);
          if(!cubesTmp[0].changed) {
            cubesTmp[0].stopTranslate = !cubesTmp[0].stopTranslate;
            cubesTmp[0].stopRotate = !cubesTmp[0].stopRotate;
            cubesTmp[0].changed = true;
            console.log(cubesTmp[0].stopTranslate);
          }
        }
    });
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

      console.log("onResize: " + (window.innerWidth - 2) + ", "  + (window.innerHeight - 6));

      this.camera.camera.aspect = this.getAspectRatio();
      this.camera.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth - 2, window.innerHeight - 6);
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
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

}
