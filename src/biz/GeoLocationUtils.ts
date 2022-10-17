import { Entity } from "aframe";

export class GeoLocationUtils {
  private errorFunction = () => {
    alert("Unable to retrieve your location");
  };
  static async atCurrentPosition(success: PositionCallback) {
    navigator.geolocation.getCurrentPosition(success, () => {
      throw new Error("Unable to retrieve your location");
    });
  }
  static async atWatchPosition(success: PositionCallback) {
    navigator.geolocation.watchPosition(success, () => {
      throw new Error("Unable to retrieve your location watch");
    });
  }
  static getRandomLocation(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static distanceBetween(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) {
    console.log("distance ", lat1, lng1, lat2, lng2);

    if (lat1 === lat2 || lng1 === lng2) return 0;
    const EARTH_RADIUS = 6371;
    const R = Math.PI / 180;
    lat1 *= R;
    lng1 *= R;
    lat2 *= R;
    lng2 *= R;
    return (
      EARTH_RADIUS *
      Math.acos(
        Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
          Math.sin(lat1) * Math.sin(lat2)
      )
    );
  }

  static getDistanceToAframeEntity(
    gpsPosition: GeolocationPosition,
    target: Entity
  ): number {
    const { latitude: targetLatitude, longitude: targetLongitude } =
      target.getAttribute("gps-entity-place");
    console.log(targetLatitude, targetLongitude);
    const { latitude, longitude } = gpsPosition.coords;

    const pointDistance = Math.round(
      GeoLocationUtils.distanceBetween(
        targetLatitude,
        targetLongitude,
        latitude,
        longitude
      ) * 1000
    );
    return pointDistance;
  }
}
