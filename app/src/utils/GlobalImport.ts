import { AFrame } from "aframe";

export class GlobalImport {
  static getAnyWindow(): any {
    return window as any;
  }
  static getAFRAME(): AFrame {
    return this.getAnyWindow().AFRAME;
  }
  static getTHREE(): any {
    return this.getAnyWindow().THREE;
  }
  static getBootstrap(): any {
    return this.getAnyWindow().bootstrap;
  }
}
