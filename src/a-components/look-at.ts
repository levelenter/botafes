import { GlobalImport } from "../utils/GlobalImport";
const AFRAME = GlobalImport.getAFRAME();
const THREE = GlobalImport.getTHREE();

AFRAME.registerComponent("look-at", {
  schema: {
    target: { type: "selector" },
    always: { type: "boolean", default: false },
    is_fix_xz: { type: "boolean", default: true },
    refresh: { type: "number", default: 100 },
  },

  init: function () {
    this.lookAt_y(this.data.is_fix_xz);
  },

  tick: function (time, timeDelta) {
    if (this.data.always && this.refresh(this.data.refresh, time)) {
      this.lookAt_y(this.data.is_fix_xz);
    }
  },

  lookAt: function () {
    const obj3d = this.el.object3D;
    const cam = document.querySelector("[camera]");
    const vec3 = new THREE.Vector3();
    if (this.data.id) {
      const target = document.querySelector(this.data.target);
      const pos = target.object3D.getWorldPosition(vec3);
      obj3d.lookAt(pos);
    } else if (cam) {
      const pos = (cam as any).object3D.getWorldPosition(vec3);
      obj3d.lookAt(pos);
    } else {
      obj3d.lookAt(new THREE.Vector3(0, 0, 0));
    }
  },

  lookAt_y: function (is_fix_xz: boolean) {
    const rot = this.el.getAttribute("rotation");
    const locX = `${rot.x}`;
    const locZ = `${rot.z}`;
    this.lookAt();
    if (is_fix_xz) {
      const moved = this.el.getAttribute("rotation");
      this.el.setAttribute("rotation", `${locX} ${moved.y} ${locZ}`);
    }
  },

  refresh: function (refresh: number, tick_time: number) {
    return Math.floor(tick_time) % refresh === 0;
  },
});
