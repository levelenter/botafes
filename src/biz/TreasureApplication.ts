import { GpsContext } from "./GpsContext";
import { checkTreasure } from "./data";
import { BoxOpenButton, ResizeButton } from "./ButtonActions";
import { Treasure } from "./Treasure";
import { TreasuresContext } from "./TreasuresContext";
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

  /**
   * Leafletマップを初期化する
   * @returns
   */
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
   * マップのタイトルバーに表示する
   */
  showMapTitle(title: string) {
    const distanceLabel = getElement("map_title_label");
    distanceLabel.innerHTML = title;
  }

  /**
   * 終了ボタンをセットアップする
   */
  setupEndingButton() {
    const endBtn = getElement("ending_btn");
    endBtn.classList.remove("d-none");
    endBtn.classList.remove("d-block");
    endBtn.addEventListener("click", () => this.showEnding());
  }

  /**
   * 終了画面を表示する
   */
  showEnding() {
    dialogOpen("completeDialog");
    const video = getElement("complete_video") as HTMLVideoElement;
    video.play().then();
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
   * GPSの位置が変更された時に起動する共通処理
   * @param treasures
   * @param treasuresContext
   * @param current
   */
  commonGpsHandler = (
    treasuresContext: TreasuresContext,
    current: GeolocationPosition
  ) => {
    // 現在位置からの距離を算出
    treasuresContext.treasures.forEach((t) =>
      t.setDistanceFromGeoLocation(current)
    );

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
    this.showMapTitle(treasuresContext.displayMessage);
  };

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
     * 宝箱とGPSの管理オブジェクトを設定する
     */
    const treasuresContext = new TreasuresContext(treasuresInitData);
    const gpsContext = new GpsContext<TreasuresContext>();

    ///////////////////////////////
    // GPS初期化時の処理をコールバックとして追加
    ///////////////////////////////
    gpsContext.onGpsInit((model, current) => {
      // スタート画面のローディング表記を解除
      this.endLoading();

      // 宝箱マーカーをセット
      this.setTreasureMarkers(model.treasures);

      if (treasuresContext.isComplete) {
        this.setupEndingButton();
      }

      /**
       * 宝箱エンティティをシーンに追加
       */
      this.appendTreasureAEntity(model.treasures);

      // GPS情報更新時の共通処理
      this.commonGpsHandler(model, current);
    });

    ///////////////////////////////
    // GPS位置情報変更検知時の処理をコールバックとして追加
    ///////////////////////////////
    gpsContext.onLocationChange((model, current) => {
      // 一番近い宝箱をターゲットにする
      const nearestTreasure = model.treasures.reduce(
        (p, c) => (p.distanceByKiloMeter > c.distanceByKiloMeter ? c : p),
        model.treasures[0]
      );
      this.targetTreasureIndex = nearestTreasure.index;

      // 最寄り宝箱がNearになったら
      if (nearestTreasure.distanceByMeter < 20) {
        nearestTreasure.setGltfModel("#box");

        // BoxOpenボタン
        const boxOpenButton = new BoxOpenButton();
        const btn = boxOpenButton.showOpenBoxButton();
        btn.addEventListener("click", async () => {
          nearestTreasure.setGltfModel("#open_box");
          treasuresContext.openTreasure(nearestTreasure);
          await nearestTreasure.openEffect();
          nearestTreasure.leafletMarker.setIcon(okIcon);
          this.showMapTitle(treasuresContext.displayMessage);

          // チェックを保存
          checkTreasure(nearestTreasure.index);
          btn.remove();

          if (treasuresContext.isComplete) {
            this.showEnding();
          }
        });
      }

      // 宝箱のポップアップを更新
      treasuresContext.treasures.forEach((t) =>
        t.leafletMarker.setPopupContent(t.popUpContent)
      );

      // GPS情報更新時の共通処理
      this.commonGpsHandler(treasuresContext, current);
    });

    /**
     * GPS移動の監視を開始する
     */
    gpsContext
      .watchStart(treasuresContext)
      .catch((error) => console.error(error));
  }
}
