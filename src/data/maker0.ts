import { control } from "../utils/animationFrame";
import { waitAnimationFrame } from "../utils/animationFrame";
import { MakerData } from "./data";

const marker: MakerData = {
  marker: "0",
  video: "../../video/Highway.mp4",
  label: "速度",
  title: "ホブ",
  avatarPos: "-1 0 -9",
  avatarRot: "0 180 0",
  description: "hobhob ateste",
  speeds: [0.1, 0.5, 1.0, 2.0, 5.0],
  startIndex: 2,
  action: async (speed: number) => {
    const model = document.getElementById("model0") as any;
    while (true) {
      await waitAnimationFrame();
      model.object3D.rotation.x += speed / 10;
      if (control.isFreeze) break;
    }
  },
};
export default marker;
