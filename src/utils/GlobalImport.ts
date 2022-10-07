export class GlobalImport {
  static getAnyWindow(): any {
    return window as any;
  }
  static getAFRAME(): any {
    return this.getAnyWindow().AFRAME;
  }
  static getTHREE(): any {
    return this.getAnyWindow().THREE;
  }
  static getBootstrap(): any {
    return this.getAnyWindow().bootstrap;
  }
}
