import * as turf from "@turf/turf";
import { computeCameraPosition } from "./util";

const animatePath = async ({
  map,
  duration,
  path,
  startBearing,
  startAltitude,
  pitch,
  mapboxgl,
  lineId,
}) => {
  let bearing = startBearing;

  return new Promise(async (resolve) => {
    const pathDistance = turf.lineDistance(path);
    let startTime;

    const frame = async (currentTime) => {
      if (!startTime) startTime = currentTime;
      const animationPhase = (currentTime - startTime) / duration;

      // when the duration is complete, resolve the promise and stop iterating
      if (animationPhase > 1) {
        resolve({ endBearing: bearing });
        return;
      }
      // Get the new latitude and longitude by sampling along the path
      const alongPath = turf.along(path, pathDistance * animationPhase).geometry
        .coordinates;
      const lngLat = {
        lng: alongPath[0],
        lat: alongPath[1],
      };

      // Reduce the visible length of the line by using a line-gradient to cutoff the line
      // animationPhase is a value between 0 and 1 that reprents the progress of the animation
      map.setPaintProperty(lineId || "line", "line-gradient", [
        "step",
        ["line-progress"],
        "yellow",
        animationPhase,
        "rgba(0, 0, 0, 0)",
      ]);

      // Rotate the camera
      // bearing = startBearing - animationPhase * 200.0;
      // const bearing = startBearing;
      const camera = map.getFreeCameraOptions();

      // compute corrected camera ground position, so that he leading edge of the path is in view
      const correctedPosition = computeCameraPosition(
        pitch,
        bearing,
        lngLat,
        startAltitude,
        true // smooth
      );

      // set the pitch and bearing of the camera
      camera.setPitchBearing(pitch, bearing);
      const position = mapboxgl.MercatorCoordinate.fromLngLat(
        correctedPosition,
        startAltitude
      );
      camera.position = position;

      map.setFreeCameraOptions(camera);

      window.requestAnimationFrame(frame);
    };

    await window.requestAnimationFrame(frame);
  });
};

export default animatePath;
