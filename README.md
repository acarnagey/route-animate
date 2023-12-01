# Route Animate

Camera animate a route

[https://acarnagey.github.io/route-animate/](https://acarnagey.github.io/route-animate/)

Refs: https://www.mapbox.com/blog/building-cinematic-route-animations-with-mapboxgl
https://github.com/mapbox/impact-tools/tree/master/journey-animation-sequence
https://docs.mapbox.com/mapbox-gl-js/example/query-terrain-elevation/
https://docs.mapbox.com/help/getting-started/directions/

# Export to mp4

https://github.com/mapbox/mapbox-gl-js/blob/main/debug/video-export.html
https://ffmpeg.org/
`ffmpeg -i my_video.mp4 my_video_compressed.mp4`

# Export to gif
```bash
ffmpeg -i input.mp4 \
    -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 output.gif
```
![Gif Output Example](/docs/output.gif)

## 3D Rotation

![Rotation Diagram](/docs/rotation.png)

Bearing is same as Yaw, no Roll on Map.

![Free Camera Diagram](/docs/freecamera-pos-calc.png)

3D Chart created with GeoGebra (https://www.geogebra.org/3d/z8czvzzw)

