import { getElement, hide } from "../biz/elements";
import { GlobalImport } from "../utils/GlobalImport";
import { appendBody } from "../utils/include";
import { TreasureApplication } from "../biz/TreasureApplication";
import "../a-components/look-at";

// 開始ページを読み込む
const AFRAME = GlobalImport.getAFRAME();

// ピンチを抑制
document.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
  },
  { passive: false }
);

appendBody("./sections/complete_dialog.html").catch((error) => {
  console.error(error);
});

/**
 * GPSARの開始処理
 */
AFRAME.registerComponent("start", {
  init: function () {
    const app = new TreasureApplication();
    app.init().then(() => {
      // alert((document.querySelector("#arjs-video") as any).height);
      console.log("start treasure app");
    });

    getElement("start_btn").addEventListener("click", () => {
      hide(getElement("start_page"));
    });
  },
});
