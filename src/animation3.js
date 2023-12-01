import animatePath from "./animatePath2";
import flyInAndRotate from "./flyInAndRotate";
import * as turf from "@turf/turf";
import add3D from "./add3D2";
import { delay } from "./util";

const getPinRouteGeoJson = async () => {
  const response = await fetch("./data/route-pin3a.geojson");
  const pinRouteGeojson = await response.json();
  return pinRouteGeojson;
};

const getMapOptions = (container) => {
  return {
    container,
    projection: "globe",
    // zoom: 13,
    // zoom: 16,
    // center: [6.58968, 45.39701],
    zoom: 1.9466794621990684,
    center: { lng: -100.156972, lat: 25.731396 },
    // pitch: 76,
    pitch: 40,
    bearing: 0,
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    // interactive: false,
    interactive: true,
    // hash: true,
    hash: false,
  };
};

const playAnimations = async (mapboxgl, map, path, lineId) => {
  return new Promise(async (resolve) => {
    const targetLngLat = {
      lng: path.geometry.coordinates[0][0],
      lat: path.geometry.coordinates[0][1],
    };
    await delay(1_000);

    const { bearing, altitude } = await flyInAndRotate({
      map,
      targetLngLat,
      duration: 6_000,
      startAltitude: 3_000_000,
      endAltitude: 12_000,
      startBearing: 0,
      endBearing: -20,
      startPitch: 40,
      endPitch: 50,
      mapboxgl,
    });
    const durationFactor = 4;
    const { endBearing } = await animatePath({
      map,
      duration: 19157.779 * durationFactor,
      path,
      startBearing: bearing,
      startAltitude: altitude,
      pitch: 50,
      mapboxgl,
      lineId: "line",
    });
    await delay(1_000);
    const response = await fetch("./data/route-pin3b.geojson");
    const pinRouteGeojson = await response.json();
    const pinRoute = pinRouteGeojson.features[0].geometry.coordinates;
    const path2 = turf.lineString(pinRoute);
    map.addSource("line2", {
      type: "geojson",
      lineMetrics: true,
      data: pinRouteGeojson,
    });
    map.addLayer({
      type: "line",
      source: "line2",
      id: "line2",
      paint: {
        "line-color": "rgba(0,0,0,0)",
        "line-width": 5,
      },
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
    });
    new mapboxgl.Marker({
      color: "red",
      scale: 0.8,
      draggable: false,
      pitchAlignment: "auto",
      rotationAlignment: "auto",
    })
      .setLngLat(pinRoute[pinRoute.length - 1])
      .addTo(map);
    await animatePath({
      map,
      duration: 12_244.369 * durationFactor,
      path: path2,
      startBearing: endBearing,
      startAltitude: altitude,
      pitch: 50,
      mapboxgl,
      lineId: "line2",
    });
    // const bounds = turf.bbox(path);
    const bounds = turf.bbox({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [-100.156972, 25.731396],
          [-95.2493673, 29.8897076],
        ],
      },
    });
    map.fitBounds(bounds, {
      duration: 3000,
      pitch: 30,
      bearing: 0,
      padding: 120,
    });

    setTimeout(() => {
      resolve();
    }, 3_000);
  });
};

export { getMapOptions, playAnimations, getPinRouteGeoJson, add3D };
