import { clickSound } from "./../utils/sounds";
import { GlobalImport } from "../utils/GlobalImport";
import { getElement } from "../utils/elements";
import { waitAnimationFrame } from "../utils/animationFrame";

const AFRAME = GlobalImport.getAFRAME();

AFRAME.registerComponent("start", {
  init: async function () {
    async function toggle() {
      ids.forEach(async (id) => {
        let b = document.getElementById("sky" + id) as any;
        // b.setAttribute("opacity", id === current_id ? "1" : "0");
        b.setAttribute("opacity", "0");
        if (id === current_id) {
          let op = 0;
          for (let i = 0; i < 100; i++) {
            await waitAnimationFrame();
            op += 0.01;
            b.setAttribute("opacity", op);
          }
        }
      });
    }

    const button = getElement("warp_btn");
    let current_id = 0;
    let ids = [0, 1, 2, 3, 4];
    button.addEventListener("click", async () => {
      clickSound.play();
      await toggle();
      if (ids.length - 1 > current_id) {
        current_id++;
      } else {
        current_id = 1;
      }
    });
    await toggle();
  },
});
