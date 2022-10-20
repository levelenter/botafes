import { Treasure } from "./Treasure";
import { MapContext } from "../biz/MapContext";
import { data as treasuresInitData } from "../biz/data";
import L, { LatLng, Map, Marker } from "leaflet";
import { getElement, getXREntity } from "./elements";
import { appendBody } from "../utils/include";
import { blueIcon, greenIcon, redIcon } from "./MapIcon";

/**
 * Leafletマップと宝箱を統合
 */
export class TreasureApplication {
  private _leaflet: Map | null = null;
  userMarker = L.marker({ lat: 0, lng: 0 });
  targetTreasureIndex = 0;

  /** 最新の現在位置情報を保持 */
  private currentGpsPos: GeolocationPosition | null = null;

  /**
   * MapのインスタンスNon null
   */
  get leafletMap(): Map {
    if (!this._leaflet) throw new Error("LeafletMapが取得できませんでした");
    return this._leaflet;
  }

  /**
   * スタートページのローディング表記を終了
   */
  endLoading() {
    const loading_start = getElement("loading_start");
    loading_start.classList.add("d-none");
    const start_btn = getElement("start_btn");
    start_btn.classList.remove("d-none");
    start_btn.classList.add("d-block");
  }

  initMap() {
    const leaflet = L.map("map").fitWorld();
    leaflet.setView([35.4, 136], 5);
    leaflet.locate({ setView: true, maxZoom: 16 });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(leaflet);
    // leaflet.addControl(new (L.Control as any).Compass());

    // 国土地理院のマップの場合
    // L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
    //   attribution:
    //     "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>",
    // }).addTo(leaflet);
    return leaflet;
  }

  /**
   * GPSの位置が変更された時に起動するメソッド
   * @param treasures
   * @param map
   * @param current
   */
  onGpsUpdate = (treasures: Treasure[], current: GeolocationPosition) => {
    this.currentGpsPos = current;
    // ユーザー位置にマーカーを表示(削除・挿入)
    if (this.userMarker) this.leafletMap.removeLayer(this.userMarker);
    const currentLatLang = new LatLng(
      current.coords.latitude,
      current.coords.longitude
    );
    this.userMarker = L.marker(currentLatLang, { icon: greenIcon }).addTo(
      this.leafletMap
    );

    // 目標までの距離の更新
    const distanceLabel = getElement("distance_label");
    distanceLabel.innerHTML = `${
      treasures[this.targetTreasureIndex].distanceByMeter
    } メートル`;
  };

  /**
   * 宝箱のAエンティティをシーンに追加
   * @param treasures
   */
  appendTreasureAEntity(treasures: Treasure[]) {
    const treasureEls = treasures.map((t) => t.createAElement() as Node);
    const scene = getXREntity("a-scene");
    scene.append(...treasureEls);
  }

  /**
   * マーカーのクリックイベントを設定
   * @param marker 選択したマーカー
   * @param treasure 選択した宝箱
   * @param treasures すべての宝箱
   * @returns マーカー
   */
  markerSelect(
    marker: Marker<any>,
    currentTreasure: Treasure,
    treasures: Treasure[]
  ) {
    // 宝箱マーカークリック時
    marker.addEventListener("click", (event) => {
      currentTreasure.leafletMarkerId = event.target._leaflet_id;
      // すべてのマーカーの色をいったんもどす
      treasures.forEach((t) => t.leafletMarker.setIcon(blueIcon));
      // 対象のマーカーだけを赤にする
      marker.setIcon(redIcon);
      this.targetTreasureIndex = currentTreasure.index;

      if (!this.currentGpsPos)
        throw new Error("現在位置のキャッシュが取得できていません");
      this.onGpsUpdate(treasures, this.currentGpsPos);
    });
    return marker;
  }

  /**
   * マップに宝箱マーカーをセットしてマーカーインスタンスリストを返す
   * @param treasures
   * @returns 宝箱のマーカー
   */
  setTreasureMarkers(treasures: Treasure[]): Marker<any>[] {
    // マップに宝箱を追加
    return treasures.map((t) => {
      const pos = t.getPosition();
      const marker = L.marker([pos.latitude, pos.longitude]).addTo(
        this.leafletMap
      );
      t.leafletMarker = marker;

      // マーカーのクリックイベント
      this.markerSelect(marker, t, treasures);

      return marker;
    });
  }

  async init() {
    await appendBody("./sections/map.html");
    // 地図を初期化
    this._leaflet = this.initMap();

    /**
     * 宝箱を設定する
     */
    const map = new MapContext(treasuresInitData);

    // GPS初期化時のハンドラを追加
    map.onGpsInit((treasures, map, current) => {
      // スタート画面のローディング表記を解除
      this.endLoading();

      // 宝箱マーカーをセット
      const markers = this.setTreasureMarkers(treasures);

      /**
       * 宝箱エンティティをシーンに追加
       */
      this.appendTreasureAEntity(treasures);

      // GPS情報更新時のハンドラを起動
      this.onGpsUpdate(treasures, current);
    });

    // GPS位置情報変更検知時のハンドラを追加
    map.onLocationChange((treasures, map, current) => {
      // 宝箱を開ける処理
      // treasures.forEach((t)=>{
      //   t.setGltfModel("open_box")
      // })
      this.onGpsUpdate(treasures, current);
    });

    /**
     * GPS移動の監視を開始する
     */
    map.watchStart().catch((error: any) => {
      alert(error);
      console.error(error);
    });
  }
}
