import { TreasureData } from "./../biz/data";

export class UrlParamUtils {
  public static getParamArray(): [string, string][] {
    const s = new URLSearchParams(location.search);
    const params = Array.from(s.entries());
    console.log("treasuresInitData1", params);
    return params;
  }

  public static parseTreasure(i: number, latlang: string[], title: string) {
    return {
      id: i + 1,
      lat: parseFloat(latlang[0]),
      lng: parseFloat(latlang[1]),
      title: title,
      el: `treasure${i + 1}`,
      checked: false,
    };
  }

  public static getDataFromParam(params: [string, string][]): TreasureData[] {
    if (params.length === 0)
      throw new Error(`パラメータがURLから取得できない状態で呼び出されました`);

    const paramsJson: TreasureData[] = params
      .filter((p) => p[0].startsWith("p")) //pから始まるパラメータのみ処理
      .map((p, i) => this.parseTreasure(i, JSON.parse(p[1]), p[0])); // パラメータから宝箱データに変換
    return paramsJson;
  }
}
