import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CubeGeometry, Scene, PointLight, PerspectiveCamera, Vector3, BoxBufferGeometry, MeshBasicMaterial, Mesh, WebGLRenderer, PCFSoftShadowMap, Color, DoubleSide, Vector2, Geometry, Face3, Raycaster, ShaderMaterial, LineSegments, Box3, Ray, BoxGeometry, Matrix4, Matrix3, Line3, Line } from 'three';
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

    this.loadCubes();

    //this.loadLines();
    
    this.createCamera();

    this.createLights();

    this.startRendering();

    this.addControls();
  }

  private createCamera() {
    this.camera = new Camera();
    this.camera.camera = new PerspectiveCamera(55.0, window.innerWidth / window.innerHeight, 0.5, 300000);
    this.camera.camera.position.set(0, 0, -100);
    this.camera.camera.lookAt(new Vector3());
  }

  private createLights() {
    var light = new PointLight(0xffffff, 1, 1000);
    light.position.set(0, 1000, 1000);
    this.scene.add(light);

    var light = new PointLight(0xffffff, 1, 1000);
    light.position.set(0, 1000, -1000);
    this.scene.add(light);
  }

  private loadCubes() {
    let color = 0;
    for(let x = 0; x < 40; x++) {
      this.createCube(Math.random()*10, Math.random()*100-50, Math.random()*100-50, Math.random()*100-50, color);
      color++;
      if(color > 2) {
        color = 0;
      }
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
          cube.line.rotateX(cube.dfRotateX/30);
          cube.line.rotateY(cube.dfRotateY/30);
          cube.line.rotateZ(cube.dfRotateZ/30);
        }
        if(cube.stopTranslate == false) {
          //console.log("aa:" + cube.stopTranslate);
          cube.mesh.translateX(cube.dfTranslateX/10);
          cube.mesh.translateY(cube.dfTranslateY/10);
          cube.mesh.translateZ(cube.dfTranslateZ/10);
          cube.line.translateX(cube.dfTranslateX/10);
          cube.line.translateY(cube.dfTranslateY/10);
          cube.line .translateZ(cube.dfTranslateZ/10);
        }
        //console.log(this.cubes[x].totalRotateX);
      }
    }
  }

  private createCube(size, translateX, translateY, translateZ, color) {
    let geometry = new BoxGeometry(size, size, size, 1, 1, 1);
    let material = new MeshBasicMaterial({
      color: this.colors[color],
      side: DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    let mesh = new Mesh(geometry, material);
    mesh.rotation.x = Math.PI / 2;
    mesh.translateX(translateX);
    mesh.translateY(translateY);
    mesh.translateZ(translateZ);
    this.scene.add(mesh);
    var line = new LineSegments( geometry, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
    line.rotation.x = Math.PI / 2;
    line.translateX(translateX);
    line.translateY(translateY);
    line.translateZ(translateZ);
    let cube = new Cube();
    cube.mesh = mesh;
    cube.line = line;
    cube.stopRotate = false;
    cube.stopTranslate = false;
    cube.changed = false;
    //cube.size = size;
    this.cubes.push(cube);
    this.scene.add(line);
  }

  private colorsPalette() {
    this.colors = new Array();
    this.colors.push(new Color(0, 255, 255));
    this.colors.push(new Color(255, 0, 230));
    this.colors.push(new Color(205, 255, 0));
  }

  public render() {
    //console.log("render");

    this.moveCubes();

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
