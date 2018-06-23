import { Mesh, LineSegments } from "three";

export class Cube {
    mesh: Mesh;
    line: LineSegments;
    size: number;
    dfRotateX: number;
    dfRotateY: number;
    dfRotateZ: number;
    dfTranslateX: number;
    dfTranslateY: number;
    dfTranslateZ: number;
    stopTranslate: boolean;
    stopRotate: boolean;
    changed: boolean;
}