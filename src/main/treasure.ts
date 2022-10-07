import { GlobalImport } from "../utils/GlobalImport";
const three = GlobalImport.getTHREE();
import { appendBody, include } from "../utils/include";

// 開始ページを読み込む
const AFRAME = GlobalImport.getAFRAME();
AFRAME.registerComponent("start", {
  init: function () {
    this.scene = this.el;
  },
});
