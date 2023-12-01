import animatePath from "./animatePath1";
import flyInAndRotate from "./flyInAndRotate";
import * as turf from "@turf/turf";
import add3D from "./add3D1";

// https://docs.mapbox.com/mapbox-gl-js/example/query-terrain-elevation/

const getPinRouteGeoJson = async () => {
  const response = await fetch("./data/route-pin1.geojson");
  const pinRouteGeojson = response.json();
  return pinRouteGeojson;
};

// https://docs.mapbox.com/mapbox-gl-js/api/map/
const getMapOptions = (container) => {
  return {
    container,
    zoom: 13,
    center: [6.58968, 45.39701],
    pitch: 76,
    bearing: 150,
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    interactive: false,
    hash: false,
  };
};

const playAnimations = async (mapboxgl, map, path) => {
  return new Promise(async (resolve) => {
    // const targetLngLat = {
    //   lng: path.geometry.coordinates[0][0],
    //   lat: path.geometry.coordinates[0][1],
    // };

    // const { bearing, altitude } = await flyInAndRotate({
    //   map,
    //   targetLngLat,
    //   duration: 5_000,
    //   startAltitude: 3_000_000,
    //   endAltitude: 12_000,
    //   startBearing: 0,
    //   endBearing: -20,
    //   startPitch: 40,
    //   endPitch: 50,
    //   mapboxgl,
    // });

    await animatePath({
      map,
      duration: 20_000,
    });

    // const bounds = turf.bbox(path);
    // map.fitBounds(bounds, {
    //   duration: 3000,
    //   pitch: 30,
    //   bearing: 0,
    //   padding: 120,
    // });

    setTimeout(() => {
      resolve();
    }, 10_000);
  });
};

export { getMapOptions, playAnimations, getPinRouteGeoJson, add3D };
