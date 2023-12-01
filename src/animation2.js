import animatePath from "./animatePath2";
import flyInAndRotate from "./flyInAndRotate";
import * as turf from "@turf/turf";
import add3D from "./add3D2";
// https://github.com/mapbox/impact-tools/tree/master/journey-animation-sequence
const startBearing = 150;

const getPinRouteGeoJson = async () => {
  const response = await fetch("./data/route-pin2.geojson");
  const pinRouteGeojson = response.json();
  return pinRouteGeojson;
};

// https://docs.mapbox.com/mapbox-gl-js/api/map/
// https://github.com/mapbox/impact-tools/blob/master/journey-animation-sequence/js/scripts.js#L24
const getMapOptions = (container) => {
  return {
    container,
    projection: "globe",
    // zoom: 13,
    // zoom: 16,
    // center: [6.58968, 45.39701],
    zoom: 1.9466794621990684,
    center: { lng: 12.563530000000014, lat: 58.27372323078674 },
    // pitch: 76,
    pitch: 70,
    bearing: startBearing,
    // https://docs.mapbox.com/api/maps/styles/#classic-mapbox-styles
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    interactive: false,
    // hash: true,
    hash: false,
  };
};

const playAnimations = async (mapboxgl, map, path) => {
  return new Promise(async (resolve) => {
    const targetLngLat = {
      lng: path.geometry.coordinates[0][0],
      lat: path.geometry.coordinates[0][1],
    };

    const { bearing, altitude } = await flyInAndRotate({
      map,
      targetLngLat,
      duration: 5_000,
      startAltitude: 3_000_000,
      endAltitude: 12_000,
      startBearing: 0,
      endBearing: -20,
      startPitch: 40,
      endPitch: 50,
      mapboxgl,
    });

    await animatePath({
      map,
      duration: 20_000,
      path,
      startBearing: bearing,
      startAltitude: altitude,
      pitch: 50,
      mapboxgl,
    });

    const bounds = turf.bbox(path);
    map.fitBounds(bounds, {
      duration: 3000,
      pitch: 30,
      bearing: 0,
      padding: 120,
    });

    setTimeout(() => {
      resolve();
    }, 10_000);
  });
};

export { getMapOptions, playAnimations, getPinRouteGeoJson, add3D };
