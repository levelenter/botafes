import { control } from "./../utils/animationFrame";
import { waitAnimationFrame } from "../utils/animationFrame";
import { MakerData } from "./data";

const marker: MakerData = {
  marker: "1",
  video: "../../video/Sunset.mp4",
  label: "速度",
  title: "マスターギヤ",
  avatarPos: "5 0 -0.2",
  avatarRot: "0 90 0",
  description: "testtest ttest",
  speeds: [0.1, 0.5, 1.0, 2.0, 5.0],
  startIndex: 2,
  action: async (speed: number) => {
    control.start();
    console.log("model1 y");
    const model = document.getElementById("model1") as any;
    while (true) {
      await waitAnimationFrame(control.isFreeze);
      model.object3D.rotation.y += speed / 10;
      if (control.isFreeze) break;
    }
  },
};
export default marker;
