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
  const s = new URLSearchParams(location.search);
  const params = Array.from(s.entries());
  console.log("treasuresInitData1", params);
  if (params.length > 0) {
    const paramsJson: (TreasureData | null)[] = params.map((p, i) => {
      console.log("treasuresInitData", p[0], p[1]);
      const paramItem = p[0];
      if (p.length <= 0) return null;
      const latlang = JSON.parse(p[1]);
      console.log("treasuresInitData", latlang);
      return {
        id: i + 1,
        lat: parseFloat(latlang[0]),
        lng: parseFloat(latlang[1]),
        title: paramItem,
        el: `treasure${i + 1}`,
      };
    });
    return paramsJson.filter((p) => p);
  } else {
    return data;
  }
})();
