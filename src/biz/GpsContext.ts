import { GeoLocationUtils } from "./GeoLocationUtils";

export type EventHandler<T> = (model: T, current: GeolocationPosition) => void;

/**
 * GPS利用のコンテキスト
 */
export class GpsContext<T> {
  constructor() {}

  ///////////////////////////////////////
  // GPS part
  ///////////////////////////////////////
  private _onGpsInit: EventHandler<T> | null = null;
  private _onLocationChange: EventHandler<T> | null = null;
  private geoLocationPosition: GeolocationPosition | null = null;

  /**
   * Gpsの初期化時のイベントハンドラを設定
   * @param callback
   */
  onGpsInit(callback: EventHandler<T>) {
    this._onGpsInit = callback;
  }

  /**
   * ロケーションが変わった時に実行するイベントハンドラ
   * @param callback
   */
  onLocationChange(callback: EventHandler<T>) {
    this._onLocationChange = callback;
  }

  /**
   * GPSの初期設定と各宝箱の設定
   */
  private gpsInit(model: T) {
    GeoLocationUtils.atCurrentPosition((position: GeolocationPosition) => {
      this.geoLocationPosition = position;

      // コールバックがあれば起動
      this._onGpsInit && this._onGpsInit(model, this.geoLocationPosition);
    });
  }

  /**
   * 移動時のGPSLocationを監視して宝箱にセット
   * @returns
   */
  async watchStart(model: T): Promise<void> {
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by your browser");
    }

    /**
     * GPSの初期化
     */
    this.gpsInit(model);

    /**
     * GPSの監視
     */
    return await GeoLocationUtils.atWatchPosition(
      (position: GeolocationPosition) => {
        this.geoLocationPosition = position;

        // コールバックがあれば起動
        this._onLocationChange &&
          this._onLocationChange(model, this.geoLocationPosition);
      }
    );
  }
}
