import L from "leaflet";
export function mapInit(lat: number, lng: number) {
  const map = L.map("map", {
    center: [lat, lng],
    zoom: 8,
  });

  let basemap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/nathanhnew/cj62p1p9l3nyx2qp07zm12yh5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmF0aGFuaG5ldyIsImEiOiJjajYxZXJ2NHowdHk1MnFvZnFvcjE2aTZ3In0.uyW_Te8pYugmfTiKuVHvOA",
    {
      attribution: "Imagery &copy; Mapbox, Map Data &copy; OpenStreetMap |",
    }
  );

  let radarWMS = L.tileLayer.wms(
    "https://nowcoast.noaa.gov/arcgis/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/WMSServer",
    {
      layers: "1",
      format: "image/png",
      transparent: true,
      opacity: 0.8,
      attribution:
        "Radar data provided by National Weather Service via nowCOAST",
    }
  );
  const warningsWMS = L.tileLayer.wms(
    "https://nowcoast.noaa.gov/arcgis/services/nowcoast/wwa_meteoceanhydro_shortduration_hazards_warnings_time/MapServer/WMSServer",
    {
      layers: "1",
      format: "image/png",
      transparent: true,
      opacity: 0.8,
      attribution: "nowCOAST",
    }
  );
  const overlay = L.tileLayer(
    "https://api.mapbox.com/styles/v1/nathanhnew/cj62phsw73npj2rphndjzt3i2/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmF0aGFuaG5ldyIsImEiOiJjajYxZXJ2NHowdHk1MnFvZnFvcjE2aTZ3In0.uyW_Te8pYugmfTiKuVHvOA"
  );
  let layers = L.layerGroup([basemap, radarWMS, warningsWMS, overlay]).addTo(
    map
  );
  // initialized = true;
}
