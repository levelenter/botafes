import { getElement } from "./elements";

const UP_IMG = "../../assets/up.png";
const DOWN_IMG = "../../assets/down.png";

/**
 * マップタブをリサイズする▲▼ボタン
 */
export class ResizeButton {
  classClear(map: HTMLElement) {
    map.classList.remove("map_min", "map_max", "map_default");
  }

  setButtonImage(path: string) {
    getElement("resize_button").querySelector("img")?.setAttribute("src", path);
  }

  setMin(map: HTMLElement) {
    this.classClear(map);
    map.classList.add("map_min");
    this.setButtonImage(UP_IMG);
  }

  setMax(map: HTMLElement) {
    this.classClear(map);
    map.classList.add("map_max");
    this.setButtonImage(DOWN_IMG);
  }

  setDefault(map: HTMLElement) {
    this.classClear(map);
    map.classList.add("map_default");
    this.setButtonImage(UP_IMG);
  }

  setupMapResizeButton() {
    const resize = getElement("resize_button");
    const contains = (map: any, cl: string) => map.classList.contains(cl);

    resize.addEventListener("click", () => {
      const map = getElement("map_tab");
      contains(map, "map_default")
        ? this.setMax(map)
        : contains(map, "map_max")
        ? this.setMin(map)
        : contains(map, "map_min")
        ? this.setDefault(map)
        : undefined;
    });
  }
}

/**
 * 近づいた時に表示されるボックスのオープンボタン
 */
export class BoxOpenButton {
  /**
   *
   */
  showOpenBoxButton(): HTMLElement {
    const openBoxButton = getElement("open_box_button");
    openBoxButton.classList.remove("d-none");
    openBoxButton.classList.add("d-block");
    return openBoxButton;
  }
}
