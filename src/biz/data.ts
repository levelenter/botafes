import { UrlParamUtils } from "../utils/UrlParamUtils";

export type TreasureData = {
  id: number;
  lat: number;
  lng: number;
  title: string;
  el: string;
};

export const data: TreasureData[] = [
  {
    id: 1,
    lat: 34.6745469127447,
    lng: 135.49032039571802,
    title: "堀江小学校",
    el: "treasure1",
  },
  {
    id: 2,
    lat: 34.67553087191428,
    lng: 135.4933715822677,
    title: "西大橋駅",
    el: "treasure2",
  },
];

export const treasuresInitData = (() => {
  const array = UrlParamUtils.getParamArray();
  return array.length > 0
    ? UrlParamUtils.getDataFromParam(array).filter((p) => p)
    : data;
})();
