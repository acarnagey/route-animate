import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { useEffect, useRef, useState } from "react";
import * as turf from "@turf/turf";
import "./App.css";

// import {
//   add3D,
//   getMapOptions,
//   getPinRouteGeoJson,
//   playAnimations,
// } from "./animation2";
import {
  add3D,
  getMapOptions,
  getPinRouteGeoJson,
  playAnimations,
} from "./animation3";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX;

const App = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new mapboxgl.Map(getMapOptions(mapContainerRef.current));
    const map = mapRef.current;
    map.addControl(new mapboxgl.NavigationControl());
    (async () => {
      // Start downloading the route data, and wait for map load to occur in parallel
      const [pinRouteGeojson] = await Promise.all([
        getPinRouteGeoJson(),
        // promise version of callback map.on('load', callback)
        map.once("style.load"),
      ]);
      add3D(map);
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
      await playAnimations(mapboxgl, map, path);
      setIsFinished(true);
    })();
  }, []);
  return (
    <>
      <div id="map" ref={mapContainerRef} />
      {isFinished && (
        <div
          style={{
            color: "#0F0",
            position: "absolute",
            top: 10,
            left: 10,
            fontSize: "24px",
            fontWeight: "bold",
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "6px",
            padding: "8px",
          }}
        >
          Finished!
        </div>
      )}
    </>
  );
};

export default App;
