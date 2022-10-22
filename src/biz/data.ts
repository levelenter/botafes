import { UrlParamUtils } from "../utils/UrlParamUtils";

export type TreasureData = {
  id: number;
  lat: number;
  lng: number;
  title: string;
  el: string;
  checked: boolean;
};

export const data: TreasureData[] = [
  {
    id: 1,
    lat: 34.6745469127447,
    lng: 135.49032039571802,
    title: "堀江小学校",
    el: "treasure1",
    checked: false,
  },
  {
    id: 2,
    lat: 34.67553087191428,
    lng: 135.4933715822677,
    title: "西大橋駅",
    el: "treasure2",
    checked: false,
  },
];
const KEY = "savedData";
export const saveState = (data: TreasureData[]) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

const getSavedState = (): TreasureData[] | null => {
  const saved = localStorage.getItem(KEY);
  return saved ? JSON.parse(saved) : null;
};

export function checkTreasure(index: number) {
  const data = treasuresInitData;
  data[index].checked = true;
  saveState(data);
}
export const treasuresInitData = (() => {
  const array = UrlParamUtils.getParamArray();
  const saved = getSavedState();
  let result = data;
  if (saved) {
    result = saved;
  } else if (array.length > 0) {
    result = UrlParamUtils.getDataFromParam(array).filter((p) => p);
  }
  saveState(result);
  return result;
})();
