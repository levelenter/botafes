import { getElement, hide } from "../biz/elements";
import { GlobalImport } from "../utils/GlobalImport";
import { appendBody } from "../utils/include";
import { TreasureApplication } from "../biz/TreasureApplication";
import "../a-components/look-at";

// 開始ページを読み込む
const AFRAME = GlobalImport.getAFRAME();
appendBody("./sections/start_page.html")
  .then(() => {
    getElement("start_btn").addEventListener("click", () => {
      hide(getElement("start_page"));
    });
  })
  .catch((error) => {
    console.error(error);
  });

// エラーコンソール画面を取り込む
appendBody("./sections/error_console.html").catch((error) => {
  console.error(error);
});

/**
 * GPSARの開始処理
 */
AFRAME.registerComponent("start", {
  init: function () {
    const app = new TreasureApplication();
    app.init();
  },
});
