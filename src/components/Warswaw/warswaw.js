var blur = document.getElementById("blur");
var radius = document.getElementById("radius");

proj4.defs(
  "EPSG:4277",
  "+proj=longlat +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +no_defs "
);
ol.proj.proj4.register(proj4);

var vector = new ol.layer.Heatmap({
  source: new ol.source.Vector({
    url:
      "https://data.glasgow.gov.uk/dataset/d4b27465-b76c-4131-a1ff-31d038b8fdd0/resource/8eadfcc3-b91e-4b1a-a275-c0f1bcd8de7d/download/railway-line.geojson",
    format: new ol.format.GeoJSON({
      dataProjection: "EPSG:4277",
    }),
  }),
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10),
});

var defaultStyleFunction = vector.getStyleFunction();
vector.setStyle(function (feature, resolution) {
  var style = defaultStyleFunction(feature, resolution);
  var geom = feature.getGeometry();
  if (geom.getType() == "LineString") {
    style[0].setGeometry(new ol.geom.Point(geom.getCoordinateAt(0.5)));
  }
  return style;
});

vector.getSource().on("addfeature", function (event) {
  var name = event.feature.get("IDENTIFIER");
  event.feature.set("weight", (name - 2500000000000) / 200000000000);
});

var raster = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: "toner",
  }),
});

var map = new ol.Map({
  layers: [raster, vector],
  target: "map",
  view: new ol.View({
    center: ol.proj.transform([-4.23, 55.86], "EPSG:4277", "EPSG:3857"),
    zoom: 14,
  }),
});

blur.addEventListener("input", function () {
  vector.setBlur(parseInt(blur.value, 10));
});

radius.addEventListener("input", function () {
  vector.setRadius(parseInt(radius.value, 10));
});
