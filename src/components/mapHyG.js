
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
import data from "./data.json"
import outputData from "./output.json"
import { render } from "@testing-library/react";
import { Container, Row, Col } from 'reactstrap';



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


const drawerWidth = 240;


class MyMap extends React.Component {
    constructor(props) {
        super(props);
        this.infoRef = React.createRef();
        this.state = {
            info: "", isDrawerOpen: false, features: {
                DTW: false, WD: false, WH: false, HC: false,
            }
        };
    }

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


    componentDidMount() {


        const geojsonObj = {
            "type": "FeatureCollection",
            "features": []
        }

        var vectorSource = new VectorSource({
            features: (new GeoJSON()).readFeatures(geojsonObj)
        });

        // for specific conductivity

        outputData.forEach((el) => {
            var x = el.geometry.coordinates[0]
            var y = el.geometry.coordinates[1]

            var iconFeature = new Feature({
                geometry: new Point(transform([x, y], 'EPSG:4326', 'EPSG:3857')),
                name: 'Marker ',
                "properties": { SPC: parseFloat(el.properties.Specific_capacity) }


            });

            vectorSource.addFeature(iconFeature);

        })

        function getStyleSpfCon(feature) {
            return new Style({
                image: new CircleStyle({
                    radius: feature.get("properties").SPC / 2,
                    fill: new Fill({

                        color: 'rgba(247, 202, 24, 0.8)'
                    }),
                    stroke: new Stroke({ color: 'rgba(247, 202, 24, 0.8)', width: 1 })


                })
            });
        }

        var vectorLayerForSpfCon = new VectorLayer({
            fKey: "SPC",
            source: vectorSource,
            style: getStyleSpfCon
        });


        // for DTW, WEll g´head, well depth

        data.forEach((el) => {
            var x = el.Longitude
            var y = el.Lattitude

            var iconFeature = new Feature({
                geometry: new Point(transform([x, y], 'EPSG:4326', 'EPSG:3857')),
                name: 'Marker ',
                "properties": { DTW: parseFloat(el.DTW), Wellhead: parseFloat(el.Wellhead), WellDepth: parseFloat(el.Well_depth) }

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
                    radius: feature.get("properties").Wellhead * 5,

                }),
                stroke: new Stroke({ color: 'rgba(255,0, 0, 0.3)', width: 1 })
            });
        }
        function getStyleDepth(feature) {
            return new Style({
                image: new RegularShape({
                    fill: new Fill({
                        color: 'rgba(0,255, 0,  1)'
                    }),
                    stroke: new Stroke({ color: 'rgba(0, 255,0, 1)', width: 1 }),
                    points: 3,
                    radius: feature.get("properties").WellDepth / 10,
                    rotation: Math.PI / 4,
                    angle: 0
                })
            })
        }
        // getting all the layers

        var vectorLayerForDTW = new VectorLayer({
            fKey: "DTW",
            source: vectorSource,
            style: getStyleDTW
        });
        var vectorLayerForWellHead = new VectorLayer({
            fKey: "Wellhead",
            source: vectorSource,
            style: getStyleWellHead
        });

        var vectorLayerForWllDepth = new VectorLayer({
            fKey: "WellDepth",
            source: vectorSource,
            style: getStyleDepth
        });


        // pop up ovberlay
        // var info = document.getElementById('info');
        console.log(this.infoRef.current);
        const overLayer = new Overlay({
            element: this.infoRef.current
        })

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
                center: fromLonLat([34.84, 36.85]),
                zoom: 11
            })
        });

        // adding overlay
        map.addOverlay(overLayer)

        // onclick on map and show pop up

        map.on('click', (evt) => {
            overLayer.setPosition(undefined)

            let pixel = evt.pixel;
            var lastPair = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                let coordinateClicked = evt.coordinate;
                overLayer.setPosition(coordinateClicked)
                return [feature, layer.values_.fKey];
            });

            this.setState(() => {
                return { pair: lastPair };
            });

        });

        this.setState({
            map: map,
            layers: {
                "DTW": vectorLayerForDTW,
                "WH": vectorLayerForWellHead,
                "WD": vectorLayerForWllDepth,
                "HC": vectorLayerForSpfCon
            }
        });


    }


    render() {
        const lastPair = this.state.pair;
        if (lastPair) {
            const feature = lastPair[0];
            const fKey = lastPair[1];

            console.log(feature, fKey)
            info = <div>{fKey}: {feature.values_.properties[fKey]}</div>;
        }

        if (this.state.map) {
            const map = this.state.map;
            ["DTW", "WH", "WD", "HC"].forEach((f) => {
                map.removeLayer(this.state.layers[f]);
                if (this.state.features[f] === true) {
                    map.addLayer(this.state.layers[f])
                }
            })
        }


        const drawerContent = <List className="myDrawer">
            <ListItem button key="k1">
                <ListItemIcon>
                    <Checkbox checked={this.state.features.DTW}
                        onChange={() => {
                            this.toogleFeature("DTW");
                        }}
                    />
                </ListItemIcon>
                <ListItemText primary="DTW" />
            </ListItem>
            <ListItem button key="k2">
                <ListItemIcon>
                    <Checkbox checked={this.state.features.WD}
                        onChange={() => {
                            this.toogleFeature("WD");
                        }}
                    />
                </ListItemIcon>
                <ListItemText primary="Well Depth" />
            </ListItem>
            <ListItem button key="k3">
                <ListItemIcon>
                    <Checkbox checked={this.state.features.WH}
                        onChange={() => {
                            this.toogleFeature("WH");
                        }}
                    />
                </ListItemIcon>
                <ListItemText primary="Well Head" />
            </ListItem>
            <ListItem button key="k4">
                <ListItemIcon>
                    <Checkbox checked={this.state.features.HC}
                        onChange={() => {
                            this.toogleFeature("HC");
                        }}
                    />
                </ListItemIcon>
                <ListItemText primary="Hydraulic Conductivity" />
            </ListItem>
        </List>;

        return (
            <>

                <Hidden xsDown >
                    <Drawer anchor="right" open={true} variant="persistent" >
                        {drawerContent}
                    </Drawer>
                </Hidden>
                <Hidden smUp>
                    <Drawer anchor="bottom" open={this.state.isDrawerOpen} variant="persistent">
                        {drawerContent}
                    </Drawer>
                </Hidden>
                <AppBar position="static">
                    <Toolbar>
                        <Hidden smUp>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.toggleDrawer}>
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                        <Typography variant="h6">
                            GeoJSON Demo with OpenLayers
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div id="map"></div>
                <div id="info" ref={this.infoRef}></div>
            </>)
    }
}





export default MyMap;