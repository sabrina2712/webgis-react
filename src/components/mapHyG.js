import React from "react";
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle, Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape } from 'ol/style';
import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import { fromLonLat, get } from "ol/proj"
import { transform } from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import Pixel from 'ol/pixel';
import data from "./data.json"




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




data.forEach((el) => {
    var x = el.Longitude
    var y = el.Lattitude

    var iconFeature = new Feature({
        geometry: new Point(transform([x, y], 'EPSG:4326', 'EPSG:3857')),
        name: 'Marker ',
        "properties": { DTW: parseFloat(el.DTW) , Wellhead: parseFloat(el.Wellhead), WellDepth: parseFloat(el.Well_depth) }
        
    });
    vectorSource.addFeature(iconFeature);
})

function getStyleDTW(feature) {
    return new Style({
        image: new CircleStyle({
            radius: feature.get("properties").DTW,
            fill: new Fill({
                color: 'rgba(0, 0, 255, 0.3)'
            }),
            stroke: new Stroke({ color: 'rgba(0, 0,255, 0.3)', width: 1 })
        })
    });
}

function getStyleWellHead(feature) {
    return new Style({
        image: new CircleStyle({
            fill: new Fill({
                color: 'rgba(255,0, 0,  0.3)'
            }),
            radius: feature.get("properties").Wellhead*5,
          
          }),
          stroke: new Stroke({ color: 'rgba(255,0, 0, 0.3)', width: 1 })
    });
}
function getStyleDepth(feature) {
    return  new Style({
        image: new RegularShape({
            fill: new Fill({
                color: 'rgba(0,255, 0,  1)'
            }),
          stroke: new Stroke({ color: 'rgba(0, 255,0, 1)', width: 1 }),
          points: 3,
          radius: feature.get("properties").WellDepth/10,
          rotation: Math.PI / 4,
          angle: 0
        })
    })
        }

var vectorLayerForDTW = new VectorLayer({
    fKey: "DTW",
    source: vectorSource,
    style: getStyleDTW
});
var vectorLayerForWellHead = new VectorLayer({
    fKey: "Wellhead",
    source: vectorSource,
    style:  getStyleWellHead
});

var vectorLayerForWllDepth = new VectorLayer({
    fKey: "WellDepth",
    source: vectorSource,
    style:  getStyleDepth
});


var info = document.getElementById('info');

const overLayer = new Overlay({
    element: info
})


document.getElementById("button").onclick = () => {
map.removeLayer(vectorLayerForDTW)
   map.removeLayer(vectorLayerForWellHead)
   map.removeLayer(vectorLayerForWllDepth)
    map.addLayer(vectorLayerForDTW);
}


document.getElementById("dtw").onchange = (event) => {
    overLayer.setPosition(undefined)
  if(event.target.checked === true)
  { map.addLayer(vectorLayerForDTW)}else {
    map.removeLayer(vectorLayerForDTW)
  }
 }

document.getElementById("Wellhead").onchange = (event) => {
    overLayer.setPosition(undefined)
    if(event.target.checked === true){
        map.addLayer(vectorLayerForWellHead);
    }else {
        map.removeLayer(vectorLayerForWellHead)
    }
}

document.getElementById("wellDepth").onchange = (event) => {
    overLayer.setPosition(undefined)
if(event.target.checked === true){
    map.addLayer(vectorLayerForWllDepth );   
}else {
    map.removeLayer(vectorLayerForWllDepth)
}
}

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


map.addOverlay(overLayer)

map.on('click', function(evt) {
   
    let pixel = evt.pixel;
    var lastPair = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        let coordinateClicked = evt.coordinate;
        overLayer.setPosition(coordinateClicked)
        return [feature, layer.values_.fKey];
    });
    const feature = lastPair[0];
    const fKey = lastPair[1];

    console.log(feature, fKey)
 info.innerHTML = `<div>${fKey}: ${feature.values_.properties[fKey]}</div>`;

});
  
}


    render() {
        return <div>
        <div id="info"></div>
        <div className="map" id= "map"/>
        <button id="button">Add Circle</button>
        <input type="checkbox" id="dtw" ></input>
              <label for="dtw" checked> DTW</label>
              <input type="checkbox" id="Wellhead" name="Wellhead"></input>
              <label for="Wellhead"> Well Head</label>
              <input type="checkbox" id="wellDepth"></input>
              <label for="welldepth"> Well Depth</label>
        </div>
    }
  }

  export default MyMap;