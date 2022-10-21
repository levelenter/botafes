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
  const s = location.search;
  const searchString = s.substring(1, s.length);
  const params = searchString.split("&");
  if (params.length > 0) {
    const paramsJson: (TreasureData | null)[] = params.map((p, i) => {
      const paramItem = p.split("=");
      if (paramItem.length <= 0) return null;
      const latlang = JSON.parse(paramItem[1]);
      console.log("treasuresInitData", latlang);
      return {
        id: i + 1,
        lat: parseFloat(latlang[0]),
        lng: parseFloat(latlang[1]),
        title: paramItem[0],
        el: `treasure${i + 1}`,
      };
    });
    return paramsJson.filter((p) => p);
  } else {
    return data;
  }
})();
