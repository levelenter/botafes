import { control } from "../utils/animationFrame";
import { waitAnimationFrame } from "../utils/animationFrame";
import { MakerData } from "./data";

const marker: MakerData = {
  marker: "2",
  video: "",
  title: "ギヤスカイビングカッタ―",
  label: "速度",
  avatarPos: "-5 0 -6.2",
  avatarRot: "0 -90 0",
  speeds: [0, 0.5, 1.0, 2.0, 5.0],
  startIndex: 2,
  description: `Michaelmas term lately over, and the Lord Chancellor sitting in
  Lincoln's Inn Hall. Implacable November weather. As much mud in the
  streets as if the waters had but newly retired from the face of the
  earth. Michaelmas term lately over, and the Lord Chancellor sitting
  in Lincoln's Inn Hall. Implacable November weather. As much mud in
  the streets as if the waters had but newly retired from the face of
  the earth. Michaelmas term lately over, and the Lord Chancellor
  sitting in Lincoln's Inn Hall. Implacable November weather. As much
  mud in the streets as if the waters had but newly retired from the
  face of the earth. Michaelmas term lately over, and the Lord
  Chancellor sitting in Lincoln's Inn Hall. Implacable November
  weather. As much mud in the streets as if the waters had but newly
  retired from the face of the earth. Michaelmas term lately over, and
  the Lord Chancellor sitting in Lincoln's Inn Hall. Implacable
  November weather. As much mud in the streets as if the waters had
  but newly retired from the face of the earth. Michaelmas term lately
  over, and the Lord Chancellor sitting in Lincoln's Inn Hall.
  Implacable November weather. As much mud in the streets as if the
  waters had but newly retired from the face of the earth. Michaelmas
  term lately over, and the Lord Chancellor sitting in Lincoln's Inn
  Hall. Implacable November weather. As much mud in the streets as if
  the waters had but newly retired from the face of the earth.
  Michaelmas term lately over, and the Lord Chancellor sitting in
  Lincoln's Inn Hall. Implacable November weather. As much mud in the
  streets as if the waters had but newly retired from the face of the
  earth.`,
  action: async (speed: number) => {
    const model = document.getElementById("model2") as any;
    let isXMovePositive = true;
    control.start();
    while (true) {
      await waitAnimationFrame(control.isFreeze);
      // if (!isXMovePositive) {
      //   model.object3D.position.x += 1 / 50;
      //   if (model.object3D.position.x > 0.1) {
      //     isXMovePositive = true;
      //   }
      // } else {
      //   model.object3D.position.x -= 1 / 50;
      //   if (model.object3D.position.x < -0.1) {
      //     isXMovePositive = false;
      //   }
      // }
      if (control.isFreeze) break;

      model.object3D.rotation.x += speed / 10;
    }
  },
};
export default marker;
