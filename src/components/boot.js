
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


const drawerWidth = 240;

class TurkeyService{
	getLayers = ()=>{
		return []
	}
	getInfo = ()=>{
		return <div> I am turky info</div>
	}
	getLegend = ()=>{
		return null
	}
	getFeatures = ()=>{
		
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
	}

	onMapClick = (event, map)=>{
		alert("i am turky")
    }
    
}

class GermanyService {
   
	getLayers = ()=>{
		return []
	}
	getInfo = ()=>{
		return <div> I am GermanyService info</div>
	}
	getLegend = ()=>{
		return <div id="legend"><h3 className="legend-header">Legend </h3> I am german legends</div>
	}
	getFeatures = ()=>{
		return <div> I am GermanyService features</div>
	}

	onMapClick = (event, map)=>{
		alert("i am germany")
	}
}

class MyBoot extends React.Component {
    constructor(props) {
        super(props);
        this.infoRef = React.createRef();
        this.state = {
        	locationServices: {
				"Turkey": new TurkeyService(),
				"Germany": new GermanyService(),
			},
           
            locations: {
                "Turkey": ([34.767511, 36.842215]),
                "Germany": ([13.404954, 52.520008]),
            },

            map: this.map,
            view: this.view
        };
    }

    showCenter=(area)=>{
        
        return 
    }
    /*
    abbr = (t) => {
        if (t === "WellDepth") return "WD";
        if (t === "Wellhead") return "WH";
        if (t === "DD") return "DD";
        if (t === "pump") return "PP";
        if (t === "SPC") return "HC";
        return t;
    }


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
                zoom: 6,
                duration: 300
            });
        }
        if (selectedArea === location) {
            view.animate({
                center: fromLonLat([0, 0]),
                zoom: 3,
                duration: 300
            });
        }
    }
    */
    componentDidMount() {

        var overlay = new Overlay({
            element: this.infoRef.current,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });
        const overLayer = new Overlay({
            element: this.infoRef.current
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
			const service = this.currentLocationService();
			if(service) {
				service.onMapClick(evt, map);
			}

		});

        var view = map.getView();
        console.log(view)
        // adding overlay
        map.addOverlay(overlay)
        this.setState({ map: map, overLayer: overlay })
    }

    render() {
       
		const service = this.currentLocationService();
        return <>
            <Navbar toggleDrawer={this.toggleDrawer} toggleLocation={this.toggleLocation} selectedLocation={this.state.selectedLocation} goToLocation={this.goToLocation} />

            <div id="map" className="main-map" >
				<div id="info" ref={this.infoRef}>{service ? service.getInfo() : null}</div>
				{service ? service.getLegend() : null}
			</div>

        </>
 
    }

    currentLocationService = () => {
    	return this.state.locationServices[this.state.selectedLocation];
	}
}



export default MyBoot;





    
    
    