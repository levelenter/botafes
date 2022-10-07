import { control } from "../utils/animationFrame";
import { waitAnimationFrame } from "../utils/animationFrame";
import { MakerData } from "./data";
import { gsap } from "gsap";
import { Power4 } from "gsap";

const marker: MakerData = {
  marker: "4",
  video: "",
  title: "マイクロギヤ",
  label: "サイズ",
  avatarPos: "-5 0 1.5",
  avatarRot: "0 -90 0",

  speeds: [1.0, 2.0, 4.0, 8.0, 16.0],
  startIndex: 0,
  description: "4 data of data",
  action: (speed: number) => {
    const model = document.getElementById("model4-group") as any;
    model.setAttribute("scale", `${speed} ${speed} ${speed}`);

    const ring = document.getElementById("ring") as any;
    if (ring) {
      ring.setAttribute(
        "animation",
        "property: opacity; to: 0;delay:3000 ; dur: 1000; easing: easeOutQuad; loop: false"
      );
    }
  },
};
export default marker;
