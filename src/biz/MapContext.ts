import { blueIcon, redIcon } from "./MapIcon";
import { Marker } from "leaflet";
import { GeoLocationUtils, Location } from "./GeoLocationUtils";
import { Treasure } from "./Treasure";

export type EventHandler = (
  treasures: Treasure[],
  context: MapContext,
  current: GeolocationPosition
) => void;

/**
 * 地図を表すオブジェクト
 */
export class MapContext {
  private treasures: Treasure[] = [];
  private geoLocationPosition: GeolocationPosition | null = null;

  constructor(data: any[]) {
    this.treasures = this.setupTreasures(data);
  }

  private _onGpsInit: EventHandler | null = null;
  private _onLocationChange: EventHandler | null = null;

  /**
   * 宝箱のマーカーの選択色を変更する
   * @param marker
   */
  treasureMarkerColorChange(marker: Marker) {
    // すべてのマーカーの色をいったんもどす
    this.treasures.forEach((t) => t.leafletMarker.setIcon(blueIcon));
    // 対象のマーカーだけを赤にする
    marker.setIcon(redIcon);
  }

  /**
   * Gpsの初期化時のイベントハンドラを設定
   * @param callback
   */
  onGpsInit(callback: EventHandler) {
    this._onGpsInit = callback;
  }

  /**
   * ロケーションが変わった時に実行するイベントハンドラ
   * @param callback
   */
  onLocationChange(callback: EventHandler) {
    this._onLocationChange = callback;
  }

  /**
   * GPSの初期設定と各宝箱の設定
   */
  private gpsInit() {
    GeoLocationUtils.atCurrentPosition((position: GeolocationPosition) => {
      this.geoLocationPosition = position;
      this.treasures.forEach((t) => t.setDistanceFromGeoLocation(position));

      // コールバックがあれば起動
      this._onGpsInit &&
        this._onGpsInit(this.treasures, this, this.geoLocationPosition);
    });
  }

  /**
   * 宝箱データをセットアップ
   * @param treasures
   */
  private setupTreasures(treasures: any[]): Treasure[] {
    return treasures.map(
      (v, index) => new Treasure(v.lat, v.lng, v.title, v.el, index)
    );
  }

  /**
   * 移動時のGPSLocationを監視して宝箱にセット
   * @returns
   */
  async watchStart(): Promise<void> {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }

    /**
     * GPSの初期化
     */
    this.gpsInit();

    /**
     * GPSの監視
     */
    return await GeoLocationUtils.atWatchPosition(
      (position: GeolocationPosition) => {
        this.geoLocationPosition = position;
        this.treasures.forEach((t) => t.setDistanceFromGeoLocation(position));

        // コールバックがあれば起動
        this._onLocationChange &&
          this._onLocationChange(
            this.treasures,
            this,
            this.geoLocationPosition
          );
      }
    );
  }
}
