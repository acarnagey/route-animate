// https://github.com/mapbox/impact-tools/blob/master/journey-animation-sequence/js/scripts.js#L99
const add3D = (map) => {
  // Add some fog in the background
  map.setFog({
    range: [-0.5, 2],
    color: "#def",
    "high-color": "#def",
    "space-color": "#def",
  });

  // Add terrain source, with slight exaggeration
  map.addSource("mapbox-dem", {
    type: "raster-dem",
    url: "mapbox://mapbox.terrain-rgb",
    tileSize: 512,
    maxzoom: 14,
  });
  map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
};

export default add3D;
