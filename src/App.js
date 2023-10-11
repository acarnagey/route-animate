import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import "./App.css";
import animatePath from "./animatePath2";
import flyInAndRotate from "./flyInAndRotate";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const App = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const startBearing = 150;

  const add3D = () => {
    const map = mapRef.current;

    map.setFog({
      range: [0.5, 10],
      color: "white",
      "horizon-blend": 0.2,
    });
    // map.setFog({
    //   range: [-0.5, 2],
    //   color: "#def",
    //   "high-color": "#def",
    //   "space-color": "#def",
    // });

    map.addLayer({
      id: "sky",
      type: "sky",
      paint: {
        "sky-type": "atmosphere",
        "sky-atmosphere-color": "rgba(85, 151, 210, 0.5)",
      },
    });

    map.addSource("mapbox-dem", {
      type: "raster-dem",
      url: "mapbox://mapbox.terrain-rgb",
      tileSize: 512,
      maxzoom: 14,
    });
    map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
  };

  const playAnimations = async (path) => {
    return new Promise(async (resolve) => {
      const map = mapRef.current;

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

  useEffect(() => {
    if (mapRef.current) return;
    // https://docs.mapbox.com/mapbox-gl-js/api/map/
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
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
    });
    const map = mapRef.current;
    (async () => {
      // Start downloading the route data, and wait for map load to occur in parallel
      const [pinRouteGeojson] = await Promise.all([
        fetch("./data/route-pin.geojson").then((response) => response.json()),
        // promise version of callback map.on('load', callback)
        map.once("style.load"),
      ]);
      add3D();
      const pinRoute = pinRouteGeojson.features[0].geometry.coordinates;
      new mapboxgl.Marker({
        color: "green",
        scale: 0.8,
        draggable: false,
        pitchAlignment: "auto",
        rotationAlignment: "auto",
      })
        .setLngLat(pinRoute[0])
        // .setPopup(popup)
        .addTo(map);
      // .togglePopup();
      new mapboxgl.Marker({
        color: "red",
        scale: 0.8,
        draggable: false,
        pitchAlignment: "auto",
        rotationAlignment: "auto",
      })
        .setLngLat(pinRoute[pinRoute.length - 1])
        .addTo(map);
      map.addSource("line", {
        type: "geojson",
        lineMetrics: true,
        data: pinRouteGeojson,
      });
      map.addLayer({
        type: "line",
        source: "line",
        id: "line",
        paint: {
          "line-color": "rgba(0,0,0,0)",
          "line-width": 5,
        },
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
      });
      await map.once("idle");
      const path = turf.lineString(pinRoute);
      await playAnimations(path);
    })();
  }, []);
  return <div id="map" ref={mapContainerRef} />;
};

export default App;
