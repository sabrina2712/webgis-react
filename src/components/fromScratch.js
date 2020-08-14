
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
import { toStringHDMS } from 'ol/coordinate';
import Pixel from 'ol/pixel';
import "../App.css"


import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FadeMenu from "./areaMenu"

    class TurkeyService{
"hello"
        
}  

    class GermanyService{
    
}




    class SecondMap extends React.Component {
        constructor(props) {
            super(props);
             this.infoRef = React.createRef();
                this.state= {
                    anchorEl: null,
                    locationServices: {
                            "Turkey": new TurkeyService(),
                            "Germany": new GermanyService(),
                        },
                    locations: {
                        "Turkey": ([34.767511, 36.842215]),
                        "Germany": ([13.404954, 52.520008]),
                    },
                    }
    }
    goLocation = (location) => {
            console.log(this.map)
        let view = this.map.getView()
        view.animate({
            center: fromLonLat(location),
            zoom: 6,
            duration: 300
        });
     console.log({location}) 
    

     }
 
    
        componentDidMount() {

        
            var overlay = new Overlay({
                element: this.infoRef.current,
                autoPan: true,
                autoPanAnimation: {
                    duration: 250
                }
            });
            const overLayer = new Overlay({
                element: this.infoRef.current,
            })
    
            var map = new Map({
                layers: [
                    new TileLayer({
                        source: new OSM()
                    }),
                ],
                target: 'map',
                view: new View({
                    center: [0, 0],
                    zoom: 2
                })
            })
      
         map.on('click', (evt) => {
                overLayer.setPosition(undefined)
                let pixel = evt.pixel;
                let pairs = [];
            });
    this.setState({map: map})
            var view = map.getView();
            console.log(view)
            // adding overlay
            map.addOverlay(overlay)
            
          
        }
            render(){
                let locationServices = this.state.locationServices;
                let locations = this.state.locations
                return(<>
                <div class="topnav">
                    
                    <a href="#news" onClick={()=>{
                       this.goLocation(locations.Turkey)
                       console.log(locations.Turkey)
                    }}>Turkey</a>
                    <a href="#contact"  onClick={()=>{
                        console.log("hi GE")
                    }}>Germany</a>
              
                </div>
                    <div id="map" ></div>
                    
                   </>
                )

            }
  
    
    }

    export default SecondMap;