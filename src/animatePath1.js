// import * as turf from "@turf/turf";

const animatePath = async ({
  map,
  duration,
  // path,
  // startBearing,
  // startAltitude,
  // pitch,
  // popup,
  // marker,
}) => {
  return new Promise(async (resolve) => {
    // const pathDistance = turf.lineDistance(path);
    let startTime;

    const frame = async (currentTime) => {
      if (!startTime) startTime = currentTime;
      const animationPhase = (currentTime - startTime) / duration;

      // when the duration is complete, resolve the promise and stop iterating
      if (animationPhase > 1) {
        resolve();
        return;
      }
      // Get the new latitude and longitude by sampling along the path
      // const alongPath = turf.along(path, pathDistance * animationPhase).geometry
      //   .coordinates;
      // const lngLat = {
      //   lng: alongPath[0],
      //   lat: alongPath[1],
      // };

      // Sample the terrain elevation. We round to an integer value to
      // prevent showing a lot of digits during the animation
      // const elevation = Math.floor(
      //   // Do not use terrain exaggeration to get actual meter values
      //   map.queryTerrainElevation(lngLat, { exaggerated: false })
      // );

      // Update the popup altitude value and marker location
      // popup.setHTML("Altitude: " + elevation + "m<br/>");
      // marker.setLngLat(lngLat);

      // Reduce the visible length of the line by using a line-gradient to cutoff the line
      // animationPhase is a value between 0 and 1 that reprents the progress of the animation
      map.setPaintProperty("line", "line-gradient", [
        "step",
        ["line-progress"],
        "red",
        animationPhase,
        "rgba(0, 0, 0, 0)",
      ]);

      // Rotate the camera at a slightly lower speed to give some parallax effect in the background
      // Not neccesary but gives a subtle cinematic rotation effect
      const rotation = 150 - animationPhase * 40.0;
      map.setBearing(rotation % 360);

      window.requestAnimationFrame(frame);
    };

    await window.requestAnimationFrame(frame);
  });
};

export default animatePath;
