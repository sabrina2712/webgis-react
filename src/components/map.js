import React from 'react'

// Start Openlayers imports
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

/*
import Grid from '@material-ui/core/Grid'
import Feature from 'ol/Feature';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape } from 'ol/style';
import Overlay from 'ol/Overlay';
import { toLonLat } from 'ol/proj';
import { fromLonLat, get } from "ol/proj"
import { transform } from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';
import Pixel from 'ol/pixel';
import data from "./data.json";
import GeoJSON from 'ol/format/GeoJSON';
import { Circle, Point } from 'ol/geom';
*/



// End Openlayers imports
class MyMap extends React.Component {
  
  //other functions eliminated for brevity

  componentDidMount() {
  var map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });

  }


  render () {
    return (
    <div id="map"> </div>
    );
  }
 
}

export default MyMap;