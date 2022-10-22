import { checkTreasure, data, saveState } from "./data";
import { BoxOpenButton, ResizeButton } from "./ButtonActions";
import { Treasure } from "./Treasure";
import { MapContext } from "../biz/MapContext";
import { treasuresInitData } from "../biz/data";
import L, { LatLng, Map, Marker } from "leaflet";
import { getElement, getXREntity } from "./elements";
import { appendBody } from "../utils/include";
import { okIcon, personIcon, redIcon } from "./MapIcon";
import { dialogOpen } from "../utils/dialogOpen";

/**
 * Leafletマップと宝箱を統合
 */
export class TreasureApplication {
  private _leaflet: Map | null = null;
  userMarker = L.marker({ lat: 0, lng: 0 });
  targetTreasureIndex = 0;

  private mapContext = new MapContext([]);

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

  clickMapResize() {}

  initMap() {
    const leaflet = L.map("map").fitWorld();
    leaflet.setView([35.4, 136], 5);
    leaflet.locate({ setView: true, maxZoom: 16 });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(leaflet);
    return leaflet;
  }

  /**
   * GPSの位置が変更された時に起動するメソッド
   * @param treasures
   * @param map
   * @param current
   */
  onGpsUpdate = (
    treasures: Treasure[],
    map: MapContext,
    current: GeolocationPosition
  ) => {
    // ユーザー位置にマーカーを表示(削除・挿入)
    if (this.userMarker) this.leafletMap.removeLayer(this.userMarker);
    const currentLatLang = new LatLng(
      current.coords.latitude,
      current.coords.longitude
    );
    this.userMarker = L.marker(currentLatLang, { icon: personIcon }).addTo(
      this.leafletMap
    );

    // 目標までの距離の更新
    this.showMapTitle(map.displayMessage);
  };

  /**
   * マップのタイトルバーに表示する
   */
  showMapTitle(title: string) {
    const distanceLabel = getElement("map_title_label");
    distanceLabel.innerHTML = title;
  }

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
  markerSelect(marker: Marker<any>, currentTreasure: Treasure) {
    marker
      .bindPopup(
        `${currentTreasure.title}:${currentTreasure.distanceByMeter}メートル`,
        { autoPan: true }
      )
      .openPopup();
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

      marker.setIcon(t.checked ? okIcon : redIcon);
      t.leafletMarker = marker;

      // マーカーのクリックイベント
      this.markerSelect(marker, t);

      return marker;
    });
  }

  /**
   * アプリケーション初期化
   */
  async init() {
    await appendBody("./sections/map.html");
    // 地図を初期化
    this._leaflet = this.initMap();

    // マップのリサイズボタンにハンドラを設定
    new ResizeButton().setupMapResizeButton();

    /**
     * 宝箱を設定する
     */
    console.log("treasuresInitData", treasuresInitData);
    this.mapContext = new MapContext(treasuresInitData);

    ///////////////////////////////
    // GPS初期化時の処理
    ///////////////////////////////
    this.mapContext.onGpsInit((treasures, map, current) => {
      // スタート画面のローディング表記を解除
      this.endLoading();

      // 宝箱マーカーをセット
      this.setTreasureMarkers(treasures);

      /**
       * 宝箱エンティティをシーンに追加
       */
      this.appendTreasureAEntity(treasures);

      // GPS情報更新時の共通処理
      this.onGpsUpdate(treasures, map, current);
    });

    ///////////////////////////////
    // GPS位置情報変更検知時の処理
    ///////////////////////////////
    this.mapContext.onLocationChange((treasures, map, current) => {
      // 一番近い宝箱をターゲットにする
      const nearestTreasure = treasures.reduce(
        (p, c) => (p.distanceByKiloMeter > c.distanceByKiloMeter ? c : p),
        treasures[0]
      );
      this.targetTreasureIndex = nearestTreasure.index;

      // 最寄り宝箱がNearになったら
      if (nearestTreasure.distanceByMeter < 15) {
        // BoxOpenボタン
        const boxOpenButton = new BoxOpenButton();
        const btn = boxOpenButton.showOpenBoxButton();
        btn.addEventListener("click", async () => {
          nearestTreasure.setGltfModel("#open_box");
          map.openTreasure(nearestTreasure);
          await nearestTreasure.openEffect();
          nearestTreasure.leafletMarker.setIcon(okIcon);
          this.showMapTitle(map.displayMessage);

          // チェックを保存
          checkTreasure(nearestTreasure.index);

          btn.remove();
          if (map.isComplete) {
            dialogOpen("completeDialog");
            const video = getElement("complete_video") as HTMLVideoElement;
            video.play().then();
          }
        });
      }

      // 宝箱のポップアップを更新
      treasures.forEach((t) => t.leafletMarker.setPopupContent(t.popUpContent));

      // GPS情報更新時の共通処理
      this.onGpsUpdate(treasures, map, current);
    });

    /**
     * GPS移動の監視を開始する
     */
    this.mapContext.watchStart().catch((error: any) => {
      console.error(error);
    });
  }
}
