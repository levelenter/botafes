import { control } from "../utils/animationFrame";
import { waitAnimationFrame } from "../utils/animationFrame";
import { MakerData } from "./data";

const marker: MakerData = {
  marker: "5",
  video: "",
  title: "代表 小笠原真智",
  label: "サイズ",
  avatarPos: "0 0 0",
  avatarRot: "0 0 0",
  speeds: [1.0, 2.0, 4.0, 8.0, 16.0],
  startIndex: 0,
  description: "5 data of data",
  action: (speed: number) => {
    const model = document.getElementById("model5") as any;
    model.setAttribute("scale", `${speed} ${speed} ${speed}`);
  },
};
export default marker;
