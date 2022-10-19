import { AFrame, Entity } from "aframe";
import { Power4 } from "gsap";
import { gsap } from "gsap";

export function show(element: HTMLElement) {
  element.classList.remove("d-none");
  element.classList.remove("d-block");
  element.style.opacity = "0";
  // 表示アニメーション
  gsap.to(element, {
    autoAlpha: 1,
    duration: 1,
    ease: Power4.out,
    onComplete: () => {
      element.classList.add("d-block");
    },
  });
}

export function hide(element: HTMLElement) {
  element.classList.remove("d-block");
  element.classList.remove("d-none");
  // 透明化アニメーション
  gsap.to(element, {
    autoAlpha: 0,
    duration: 0.5,
    ease: Power4.out,

    onComplete: () => {
      element.classList.add("d-none");
    },
  });
}
type HtmlElementType =
  | "warp_btn"
  | "test"
  | "distance_label"
  | "map"
  | "treasure1"
  | "treasure2"
  | "treasure3"
  | "start_btn"
  | "start_page"
  | "open_button"
  | "sensor"
  | "lat"
  | "lng";

export function getElement(id: HtmlElementType): HTMLButtonElement {
  const elm = document.getElementById(id) as HTMLButtonElement;
  if (!elm) throw new Error(`${id}要素が取れませんでした`);
  return elm;
}

export function getXREntity(id: HtmlElementType): Entity {
  const elm = document.getElementById(id) as any;
  if (!elm) throw new Error(`${id}要素が取れませんでした`);
  return elm;
}
