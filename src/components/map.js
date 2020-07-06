import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import Overlay from 'ol/Overlay';
import GeoJSON from 'ol/format/GeoJSON';
import { Vector as VectorSource } from 'ol/source';
import data from "./data.json";
import Feature from 'ol/Feature';
import { transform } from 'ol/proj';
import { Circle, Point } from 'ol/geom';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import outputData from "./output.json"


class MyMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {info: ""};
  }
  componentDidMount(){
    const geojsonObj = {
      "type": "FeatureCollection",
      "features": []
  }
  
  var vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(geojsonObj)
  });
  
outputData.forEach((el) => {
  console.log(el)
})






var map = new Map({
  layers: [
      new TileLayer({
          source: new OSM()
      }),
  ],
  target: 'map',
  view: new View({
      center: fromLonLat([34.84, 36.85]),
      zoom: 11
  })
});

  }
}