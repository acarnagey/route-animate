const fs = require("fs");
// directions to https://docs.mapbox.com/help/getting-started/directions/
// Avenida Villa De San Carlos, 66644 Apodaca, Nuevo León, Mexico
// 8051 Anderson Loop, Elmendorf, Texas 78112, United States
// 9518 East Mount Houston Road, Houston, Texas 77050, United States
const directions = [];
const coordinates = [];
directions.map((direction) => {
  return direction.legs.map((leg) => {
    return leg.steps.map((step) => {
      return step.intersections.map((intersection) => {
        const { location } = intersection;
        coordinates.push(location);
        return location;
      });
    });
  });
});
const c = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates,
      },
    },
  ],
};
fs.writeFileSync("line.geojson", JSON.stringify(c, null, 2));
