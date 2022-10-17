import { getElement, getXREntity, hide } from "../biz/elements";
import { GeoLocationUtils } from "../biz/GeoLocationUtils";
import { GlobalImport } from "../utils/GlobalImport";
import { appendBody } from "../utils/include";

// 開始ページを読み込む
const AFRAME = GlobalImport.getAFRAME();
appendBody("./sections/start_page.html").then(() => {
  getElement("start_btn").addEventListener("click", () => {
    hide(getElement("start_page"));
  });
});

AFRAME.registerComponent("start", {
  scene: AFRAME.AEntity,
  init: function () {
    this.scene = this.el;
    geoSetup();
    geoFindMe();
  },
});

function showMessage(message: string) {
  // const status = document.querySelector("#status") as HTMLElement;
  // status.textContent = message;
}

function geoSetup() {
  // Geolocation guard
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser");
  }

  const treasure = getXREntity("treasure");

  GeoLocationUtils.atCurrentPosition((position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    const lat = getElement("lat");
    const lng = getElement("lng");
    const distanceLabel = getElement("distance_label");

    const randomLatitude = GeoLocationUtils.getRandomLocation(0.00004, 0.00005);
    const randomLongitude = GeoLocationUtils.getRandomLocation(
      0.00004,
      0.00005
    );
    lat.innerHTML = `${latitude}:${latitude + randomLatitude}`;
    lng.innerHTML = `${longitude}:${longitude + randomLongitude}`;

    const distanceLength = GeoLocationUtils.distanceBetween(
      latitude,
      randomLatitude,
      longitude,
      randomLongitude
    );
    distanceLabel.innerHTML = `${distanceLength}`;

    let treasureLatitude = latitude + randomLatitude;
    let treasureLongitude = longitude + randomLongitude;

    treasure.setAttribute(
      "gps-entity-place",
      `latitude:${treasureLatitude}; longitude:${treasureLongitude};`
    );
  });
}

function buildButtonWhenFindTreasure(isClear: boolean = false) {
  const button = getXREntity("open_button") as HTMLElement;
  if (isClear) {
    button.innerHTML = "";
    return;
  }
  button.setAttribute("class", "buttons");
  button.setAttribute("type", "button");
  button.addEventListener("click", () => {
    const treasureBox = getXREntity("treasure");
    treasureBox.setAttribute("gltf-model", "./model/le_takarabako_open.glb");
  });
  button.textContent = "開く";
}

/**
 * distanceType : "found" | "near" | "far"
 */
function buildPositionDisplay(distanceType: any, pointDistance: any) {
  const positions = getElement("sensor");

  const message =
    distanceType === "found"
      ? "見つけた"
      : distanceType === "near"
      ? "近いぞ"
      : "";
  positions.innerHTML = `<div>
      ${pointDistance} m
      <br>${message}
    </div>`;
}

function geoFindMe() {
  if (!navigator.geolocation) {
    showMessage("Geolocation is not supported by your browser");
  }

  const treasure = getXREntity("treasure");

  const success = (position: any) => {
    const pointDistance = GeoLocationUtils.getDistanceToAframeEntity(
      position,
      treasure
    );

    if (pointDistance <= 20) {
      treasure.setAttribute("opacity", `1`);
      treasure.setAttribute("color", `red`);

      buildButtonWhenFindTreasure();

      buildPositionDisplay("found", pointDistance);
    } else if (pointDistance <= 50) {
      treasure.setAttribute("opacity", `1`);
      treasure.setAttribute("color", `black`);

      buildButtonWhenFindTreasure(true);

      buildPositionDisplay("near", pointDistance);
    } else {
      treasure.setAttribute("opacity", `0`);

      buildButtonWhenFindTreasure(true);

      buildPositionDisplay("far", pointDistance);
    }
  };

  showMessage("Locating");

  GeoLocationUtils.atWatchPosition(success);
}
