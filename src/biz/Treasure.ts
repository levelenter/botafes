import { GeoLocationUtils, Location } from "./GeoLocationUtils";
import { Entity } from "aframe";
import { Marker } from "leaflet";

/**
 * 宝箱を表すオブジェクト、位置と対象との距離を保持
 */
export class Treasure {
  private latitude = 0;
  private longitude = 0;
  private title = "";
  private elementId = "";
  private _distanceByKiloMeter = 0;

  public index = 0;
  public leafletMarkerId = 0;
  public leafletMarker = new Marker([0, 0]);

  constructor(
    latitude: number,
    longitude: number,
    title: string,
    elementId: string,
    index: number
  ) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.title = title;
    this.elementId = elementId;
    this.index = index;
  }

  /**
   * AFrameのモデルエレメントを生成する（ID,初期モデル,位置を設定)
   */
  createAElement(): Entity {
    const entity = document.createElement("a-entity");
    entity.id = this.elementId;
    entity.setAttribute("gltf-model", "#box");
    entity.setAttribute(
      "gps-entity-place",
      `latitude:${this.latitude}; longitude:${this.longitude};`
    );
    return entity;
  }

  /**
   * 宝箱のAFrameエレメントを取得
   * @returns
   */
  getAElement(): Entity {
    const el = document.getElementById(this.elementId) as any;
    if (!el)
      throw new Error(`${this.elementId}:${this.title}要素が取れませんでした`);
    return el;
  }

  /**
   * 対象点から宝箱への距離を取得する
   * @param latitude
   * @param longitude
   * @returns 距離
   */
  getDistanceByLocation(location: Location) {
    const distanceLength = GeoLocationUtils.distanceBetween(
      this.latitude,
      location.latitude,
      this.longitude,
      location.longitude
    );
    return distanceLength;
  }

  /**
   * 宝箱のglTFモデルを設定/置き換える
   * @param path
   */
  setGltfModel(path: string) {
    this.getAElement().setAttribute("gltf-model", path);
  }

  /**
   * このモデルのLocationを取得する
   * @returns {latitude:number, longitude:number}
   */
  getPosition(): Location {
    return { latitude: this.latitude, longitude: this.longitude };
  }

  /**
   * 距離を取得
   * @param gpsPosition
   * @returns
   */
  getDistanceByGeolocation(gpsPosition: GeolocationPosition): number {
    const { latitude, longitude } = gpsPosition.coords;
    const pointDistance = GeoLocationUtils.distanceBetween(
      this.latitude,
      this.longitude,
      latitude,
      longitude
    );
    return pointDistance;
  }

  /**
   * 引数位置との距離を保持
   * @param position
   */
  setDistanceFromGeoLocation(position: GeolocationPosition) {
    // 引数位置との距離を取得
    this._distanceByKiloMeter = this.getDistanceByGeolocation(position);
  }

  /**
   * 対象との距離をミリ単位で返す
   */
  public get distanceByKiloMeter() {
    return this._distanceByKiloMeter;
  }

  /**
   * 対象との距離をメートル単位で返す
   */
  public get distanceByMeter() {
    return GeoLocationUtils.roundToMeter(this._distanceByKiloMeter);
  }
}
