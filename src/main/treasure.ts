import { data as treasuresInitData } from "../biz/data";
import { getElement, hide } from "../biz/elements";
import { MapContext } from "../biz/MapContext";
import { Treasure } from "../biz/Treasure";
import { GlobalImport } from "../utils/GlobalImport";
import { appendBody } from "../utils/include";
import L from "leaflet";

// 開始ページを読み込む
const AFRAME = GlobalImport.getAFRAME();
appendBody("./sections/start_page.html").then(() => {
  getElement("start_btn").addEventListener("click", () => {
    hide(getElement("start_page"));
  });
});

appendBody("./sections/map.html").then(() => {
  getElement("start_btn").addEventListener("click", () => {
    hide(getElement("start_page"));
  });
});

// function buildButtonWhenFindTreasure(isClear: boolean = false) {
//   const button = getXREntity("open_button") as HTMLElement;
//   if (isClear) {
//     button.innerHTML = "";
//     return;
//   }
//   button.setAttribute("class", "buttons");
//   button.setAttribute("type", "button");
//   button.addEventListener("click", () => {
//     treasureBox.setAttribute("gltf-model", "./model/le_takarabako_open.glb");
//   });
//   button.textContent = "開く";
// }

function initMap() {
  const leaflet = L.map("map").fitWorld();
  leaflet.setView([35.4, 136], 5);
  leaflet.locate({ setView: true, maxZoom: 16 });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(leaflet);
  // L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
  //   attribution:
  //     "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
  // }).addTo(leaflet);
  return leaflet;
}

/**
 * GPSARの開始処理
 */
AFRAME.registerComponent("start", {
  init: function () {
    // 地図を初期化
    const leaflet = initMap();

    /**
     * GPSの位置が変更された時に起動するメソッド
     * @param treasures
     * @param map
     * @param current
     */
    const onGpsUpdate = (
      treasures: Treasure[],
      map: MapContext,
      current: GeolocationPosition
    ) => {
      console.log(
        "gps update handler start",
        `${treasures[0].distanceByMeter} メートル`
      );
      treasures.forEach((t) => {
        const pos = t.getPosition();
        L.marker([pos.latitude, pos.longitude]).addTo(leaflet);
      });
      const distanceLabel = getElement("distance_label");
      distanceLabel.innerHTML = `${treasures[0].distanceByMeter} メートル`;
      console.log(treasures, current.coords);
      console.log("gps update handler end");
    };

    /**
     * 宝箱を設定する
     */
    const map = new MapContext(treasuresInitData);
    // GPS初期化時のハンドラを追加
    map.onGpsInit(onGpsUpdate);
    // GPS位置情報変更検知時のハンドラを追加
    map.onLocationChange(onGpsUpdate);
    /**
     * 監視を開始する
     */
    map.watchStart().catch((error) => {
      alert(error);
      console.error(error);
    });
  },
});
