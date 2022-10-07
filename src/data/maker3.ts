import { control } from "../utils/animationFrame";
import { waitAnimationFrame } from "../utils/animationFrame";
import { MakerData } from "./data";

const marker: MakerData = {
  marker: "3",
  video: "",
  title: "柄付きホブ",
  label: "速度",
  avatarPos: "5 0 -7.9",
  avatarRot: "0 90 0",
  speeds: [0.1, 0.5, 1.0, 2.0, 5.0],
  startIndex: 2,
  description: "3 data of data",
  action: async (speed: number) => {
    const model = document.getElementById("model3") as any;
    control.start();
    while (true) {
      await waitAnimationFrame(control.isFreeze);
      model.object3D.rotation.x += speed / 10;
      if (control.isFreeze) break;
    }
  },
};
export default marker;
