
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


import { render } from "@testing-library/react";
import { Container, Row, Col } from 'reactstrap';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'
import Navbar from "./NavBar/Navbar"




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

import "./map.css"
import { Card } from "@material-ui/core";
import { none } from "ol/centerconstraint";
import FadeMenu from "./areaMenu"
import Turkey from "./Turkey/Turkey"
import Germany from "./Germany/Germany"

const drawerWidth = 240;


class MyMap extends React.Component {
    constructor(props) {
        super(props);
        this.infoRef = React.createRef();
        this.state = {
            colorPickerVisibility: {
                DTW: false, WD: false, WH: false, HC: false, PP: false, DD: false
            },
            info: "",
            isDrawerOpen: false,
            mapClick: false,
            selectedLocation: "none",
            features: {
                DTW: false, WD: false, WH: false, HC: false, PP: false, DD: false
            },
            colors: {
                DTW: 'rgba(0, 0,255, 0.3)', WD: 'rgba(0, 128, 0, 0.9)', WH: 'rgba(255,0, 0, 0.3)',
                HC: 'rgba(247, 202, 24, 0.8)', PP: 'rgba(30,144,255, 0.7)',
                DD: 'rgba(220,20,60,0.7)'
            },
            locations: {
                "Turkey": ([34.767511, 36.842215]),
                "Germany": ([13.404954, 52.520008]),
            },

            map: this.map,
            view: this.view
        };
    }
    abbr = (t) => {
        if (t === "WellDepth") return "WD";
        if (t === "Wellhead") return "WH";
        if (t === "DD") return "DD";
        if (t === "pump") return "PP";
        if (t === "SPC") return "HC";
        return t;
    }

    /*

goToLocation =(location)=>{
   
const  selectedArea = this.location
console.log(selectedArea)
let coor =this.state.locations[this.selectedArea];
 
 
 
if(coor){
    let view =  this.state.map.getView()
    view.animate({
        center:fromLonLat(coor),
        zoom: 11,
        duration: 300
        });      

}
    
if (selectedArea === location){
   
      
        let view =  this.state.map.getView()
        view.animate({
            center:fromLonLat([0,0]),
            zoom: 2,
            duration: 300
            }); 
        
}}
    */

    handleClose = () => {
        let isDrawerOpen = this.state.isDrawerOpen;
        this.setState({ isDrawerOpen: false })
    };

    goToLocation = (location) => {
        let selectedArea = location;
        let coor = this.state.locations[location];
        let view = this.state.map.getView();

        if (coor) {
            let view = this.state.map.getView()
            view.animate({
                center: fromLonLat(coor),
                zoom: 5,
                duration: 300
            });
        }
        if (selectedArea === location) {
            view.animate({
                center: fromLonLat([0, 0]),
                zoom: 8,
                duration: 300
            });
        }
    }
    toggleLocation = (location) => {
        this.setState((state) => {
            const currentLocation = state.selectedLocation;
            console.log(currentLocation)
            if (location === currentLocation) {
                return { selectedLocation: "none" } // toggling
            } else {
                return { selectedLocation: location }
            }
        });
    }


    /*
    gettingColorWizard =(w)=>{
        {this.state.features.w === true ?
            <ListItemSecondaryAction>
                <div onClick={() => {
                      
                    this.toggleColorPicker(w);
                }}>
                    <div style={getStyle(w)} />
                </div>
            </ListItemSecondaryAction> : null}
            {this.state.colorPickerVisibility.w ? 
            <ListItem>
            <div style={{}}>
        <SketchPicker color={this.state.colors.HC} onChange={(color) => { this.changeFeatureColor("HC", color.hex) }} />
            </div>
        </ListItem> : null}
    }
        */
    changeFeatureColor = (f, color) => {
        this.setState((state) => {
            const colors = state.colors;
            colors[f] = color;
            console.log(colors);
            return { colors: colors };
        })
    };
    toogleFeature = (f) => {
        this.setState((state) => {
            const features = state.features;
            features[f] = !features[f];
            return { features: features };
        })
    }
    toggleDrawer = () => {
        this.setState((state) => {
            return { isDrawerOpen: !state.isDrawerOpen }
        })
    }
    mapOnClick = () => {
        this.setState((state) => {
            return { mapClick: !state.mapClick }
        })
    }
    componentDidMount() {

        var overlay = new Overlay({
            element: this.infoRef.current,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
        // const overLayer = new Overlay({
        //     element: this.infoRef.current
        // })


        // on click or onchange handlers

        // creating map

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

        var view = map.getView();
        console.log(view)
        // adding overlay
        map.addOverlay(overlay)

        this.setState({ map: map, overLayer: overlay })
    }

    render() {
        const studyArea =
            <>

                <AppBar position="static" style={{ background: '#2E3B55' }}>
                    <Toolbar>
                        <Typography variant="h6" >
                            Study Area
                        </Typography>
                    </Toolbar>
                </AppBar>
                <List className="myDrawer" >
                    <ListItem button key="k1"
                    >
                        <ListItemIcon>
                            <Checkbox
                                color="primary"
                                onClick={() => {
                                    this.goToLocation("Turkey")
                                }}

                            />
                        </ListItemIcon>
                        <ListItemText primary="TAR" />
                    </ListItem>
                    <ListItem button key="k2"
                    >
                        <ListItemIcon>
                            <Checkbox
                                color="primary"
                                onClick={() => {
                                    this.goToLocation("Germany")
                                }}
                            />
                        </ListItemIcon>
                        <ListItemText primary="Germany" />
                    </ListItem>
                </List>
            </>
        return <>
            <Navbar toggleDrawer={this.toggleDrawer} toggleLocation={this.toggleLocation} selectedLocation={this.state.selectedLocation} goToLocation={this.goToLocation} />

            <div id="map" className="main-map" ></div>

            {
                this.state.map ? this.getContent() : "waiting..."
            }

        </>

    }

    getContent = () => {
        const map = this.state.map
        map.getLayers().forEach(function (layer) {
            if (layer && layer.constructor.name !== "TileLayer") map.removeLayer(layer);
        });



        return this.state.selectedLocation !== "Germany" ? <Turkey isDrawerOpen={this.state.isDrawerOpen} map={this.state.map} overLayer={this.state.overLayer} mapClick={this.state.mapClick} /> :
            <Germany map={this.state.map} overLayer={this.state.overLayer} />
    }

}



export default MyMap;



