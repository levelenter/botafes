import { blueIcon, redIcon } from "./MapIcon";
import { Marker } from "leaflet";
import { Treasure } from "./Treasure";
import { TreasureData } from "./data";

/**
 * 地図を表すオブジェクト
 */
export class TreasuresContext {
  private _treasures: Treasure[] = [];
  private openedTreasures: Treasure[] = [];

  constructor(data: any[]) {
    this._treasures = this.setupTreasures(data);
    this.openedTreasures = this.treasures.filter((t) => t.checked);
  }

  /**
   * 全宝箱インスタンス
   */
  get treasures() {
    return this._treasures;
  }

  /**
   * 全部の宝箱の数
   */
  get treasureCount() {
    return this.treasures.length;
  }

  /**
   * 開いた宝箱の数
   */
  get openedTreasureCount() {
    return this.openedTreasures.length;
  }

  /**
   * マップのタブに表示するメッセージ取得
   */
  get displayMessage() {
    return `<center>のこりのタカラは${this.openedTreasureCount}/${this.treasureCount}個<BR>15メートルまでちかづいてゲット！</center>`;
  }

  /**
   * 完了判定
   */
  get isComplete() {
    return this.treasureCount === this.openedTreasureCount;
  }

  /**
   * 宝箱を開く
   * @param t
   */
  openTreasure(t: Treasure) {
    // -１なら登録されていない
    if (this.openedTreasures.findIndex((v) => v.index === t.index) < 0) {
      this.openedTreasures.push(t);
    }
  }

  /**
   * 宝箱のマーカーの選択色を変更する(他のマーカーは色を戻す)
   * @param marker
   */
  treasureMarkerColorChange(marker: Marker) {
    // すべてのマーカーの色をいったんもどす
    this.treasures.forEach((t) => t.leafletMarker.setIcon(blueIcon));
    // 対象のマーカーだけを赤にする
    marker.setIcon(redIcon);
  }

  /**
   * 宝箱データをセットアップ
   * @param treasures
   */
  private setupTreasures(treasures: TreasureData[]): Treasure[] {
    return treasures.map(
      (v, index) => new Treasure(v.lat, v.lng, v.title, v.el, index, v.checked)
    );
  }
}
