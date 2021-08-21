import React from "react";
import "ol/ol.css";
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import { Circle, Point } from "ol/geom";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Icon,
  RegularShape,
} from "ol/style";
import Overlay from "ol/Overlay";
import { toLonLat } from "ol/proj";
import { fromLonLat, get } from "ol/proj";
import { transform } from "ol/proj";
import { toStringHDMS } from "ol/coordinate";
import Pixel from "ol/pixel";
import data from "./data.json";
import outputData from "./output.json";
import dataTar from "./dataTar.json";
import { render } from "@testing-library/react";
import { Container, Row, Col } from "reactstrap";
import reactCSS from "reactcss";

import Navbar from "../NavBar/Navbar";

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import { Card } from "@material-ui/core";
import { none } from "ol/centerconstraint";

class Turkey extends React.Component {
  constructor(props) {
    super(props);
    this.infoRef = React.createRef();
    this.state = {
      colorPickerVisibility: {
        DTW: false,
        WD: false,
        WH: false,
        HC: false,
        PP: false,
        DD: false,
      },
      info: "",
      mapClick: false,
      selectedlocation: "none",
      features: {
        DTW: false,
        WD: false,
        WH: false,
        HC: false,
        PP: false,
        DD: false,
      },
      colors: {
        DTW: "rgba(0, 0,255, 0.3)",
        WD: "rgba(0, 128, 0, 0.9)",
        WH: "rgba(255,0, 0, 0.3)",
        HC: "rgba(247, 202, 24, 0.8)",
        PP: "rgba(30,144,255, 0.7)",
        DD: "rgba(220,20,60,0.7)",
      },

      map: this.map,
      view: this.view,
    };
  }

  abbr = (t) => {
    if (t === "WellDepth") return "WD";
    if (t === "Wellhead") return "WH";
    if (t === "DD") return "DD";
    if (t === "pump") return "PP";
    if (t === "SPC") return "HC";
    return t;
  };

  toggleColorPicker = (f) => {
    this.setState((state) => {
      const colorPickerVisibility = state.colorPickerVisibility;
      colorPickerVisibility[f] = !colorPickerVisibility[f];
      return colorPickerVisibility;
    });
  };
  getStyle = (f) => {
    return {
      width: "26px",
      height: "14px",
      borderRadius: "2px",
      backgroundColor: this.state.colors[f],
      margin: "75px",
    };
  };
  getPicker = (p) => {
    return (
      <ListItemSecondaryAction>
        <div
          onClick={() => {
            console.log(p);
            this.toggleColorPicker(p);
          }}
        >
          <div style={this.getStyle(p)} />
        </div>
      </ListItemSecondaryAction>
    );
  };
  getPickerVisvibility = (v) => {
    return (
      <ListItem>
        <div style={{}}>
          <SketchPicker
            color={this.state.colors.v}
            onChange={(color) => {
              this.changeFeatureColor(v, color.hex);
            }}
          />
        </div>
      </ListItem>
    );
  };

  getListItemIcon = (t) => {
    return (
      <ListItemIcon>
        <Checkbox
          checked={this.state.features.t}
          color="primary"
          onChange={() => {
            this.toogleFeature(t);
          }}
        />
      </ListItemIcon>
    );
  };
  changeFeatureColor = (f, color) => {
    const colors = this.state.colors;
    colors[f] = color;
    console.log(colors);
    return { colors: colors };
  };
  toogleFeature = (f) => {
    this.setState((state) => {
      const features = state.features;
      features[f] = !features[f];
      return { features: features };
    });
  };
  goToLocation = (location) => {
    let selectedArea = location;
    let coor = this.state.locations[location];
    let view = this.state.map.getView();

    if (coor) {
      let view = this.state.map.getView();
      view.animate({
        center: fromLonLat(coor),
        zoom: 11,
        duration: 300,
      });
    }
    if (selectedArea === location) {
      view.animate({
        center: fromLonLat([0, 0]),
        zoom: 2,
        duration: 300,
      });
    }
  };
  componentDidMount() {
    const map = this.props.map;
    const geojsonObj = {
      type: "FeatureCollection",
      features: [],
    };
    var vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObj),
    });
    // for pumping rate and drawdown
    dataTar.forEach((el) => {
      var x = el.geometry.coordinates[0];
      var y = el.geometry.coordinates[1];
      var iconFeature = new Feature({
        geometry: new Point(transform([x, y], "EPSG:4326", "EPSG:3857")),
        name: "Marker ",
        properties: {
          pump: parseFloat(el.properties.Pumping_m3),
          DD: parseFloat(el.properties.Drawdown_m),
        },
      });
      vectorSource.addFeature(iconFeature);
    });
    function getStylePump(feature) {
      return new Style({
        image: new CircleStyle({
          radius: feature.get("properties").pump * 200,
          fill: new Fill({
            color: colors.PP,
          }),
          stroke: new Stroke({ color: "rgba(30,144,255, 0.7)", width: 1 }),
        }),
      });
    }
    // style for Drawdown
    function getStyleDrwaDown(feature) {
      return new Style({
        image: new CircleStyle({
          radius: feature.get("properties").DD / 2,
          fill: new Fill({
            color: colors.DD,
          }),
          stroke: new Stroke({ color: "rgba(220,20,60,0.7)", width: 1 }),
        }),
      });
    }
    // layer for Drawdown
    var vectorLayerForDD = new VectorLayer({
      fKey: "DD",
      source: vectorSource,
      style: getStyleDrwaDown,
    });
    // layer for pump
    var vectorLayerForPump = new VectorLayer({
      fKey: "pump",
      source: vectorSource,
      style: getStylePump,
    });

    // for specific conductivity
    outputData.forEach((el) => {
      var x = el.geometry.coordinates[0];
      var y = el.geometry.coordinates[1];

      var iconFeature = new Feature({
        geometry: new Point(transform([x, y], "EPSG:4326", "EPSG:3857")),
        name: "Marker ",
        properties: { SPC: parseFloat(el.properties.Specific_capacity) },
      });
      vectorSource.addFeature(iconFeature);
    });
    const colors = this.state.colors;
    function getStyleSpfCon(feature) {
      return new Style({
        image: new CircleStyle({
          radius: feature.get("properties").SPC / 2,
          fill: new Fill({
            color: colors.HC,
          }),
          stroke: new Stroke({ color: "rgba(247, 202, 24, 0.8)", width: 1 }),
        }),
      });
    }
    var vectorLayerForSpfCon = new VectorLayer({
      fKey: "SPC",
      source: vectorSource,
      style: getStyleSpfCon,
    });
    // for DTW, WEll g´head, well depth

    data.forEach((el) => {
      var x = el.Longitude;
      var y = el.Lattitude;

      var iconFeature = new Feature({
        geometry: new Point(transform([x, y], "EPSG:4326", "EPSG:3857")),
        name: "Marker ",
        properties: {
          DTW: parseFloat(el.DTW),
          Wellhead: parseFloat(el.Wellhead),
          WellDepth: parseFloat(el.Well_depth),
        },
      });
      vectorSource.addFeature(iconFeature);
    });

    function getStyleDTW(feature) {
      return new Style({
        image: new CircleStyle({
          radius: feature.get("properties").DTW,
          fill: new Fill({
            color: colors.DTW,
          }),
          stroke: new Stroke({ color: "rgba(0, 0,255, 0.3)", width: 1 }),
        }),
      });
    }
    function getStyleWellHead(feature) {
      return new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: colors.WH,
          }),
          radius: feature.get("properties").Wellhead * 5,
        }),
        stroke: new Stroke({ color: "rgba(255,0, 0, 0.3)", width: 1 }),
      });
    }
    function getStyleDepth(feature) {
      return new Style({
        image: new RegularShape({
          fill: new Fill({
            color: colors.WD,
          }),
          stroke: new Stroke({ color: "rgba(0, 128, 0, 0.9)", width: 1 }),
          points: 3,
          radius: feature.get("properties").WellDepth / 10,
          rotation: Math.PI / 4,
          angle: 0,
        }),
      });
    }
    // getting all the layers

    var vectorLayerForDTW = new VectorLayer({
      fKey: "DTW",
      source: vectorSource,
      style: getStyleDTW,
    });
    var vectorLayerForWellHead = new VectorLayer({
      fKey: "Wellhead",
      source: vectorSource,
      style: getStyleWellHead,
    });
    var vectorLayerForWllDepth = new VectorLayer({
      fKey: "WellDepth",
      source: vectorSource,
      style: getStyleDepth,
    });

    // pop up ovberlay
    // var info = document.getElementById('info');

    // onclick on map and show pop up
    const overLayer = this.props.overLayer;

    map.on("click", (evt) => {
      overLayer.setPosition(undefined);
      let pixel = evt.pixel;
      let pairs = [];

      map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        let coordinateClicked = evt.coordinate;
        overLayer.setPosition(coordinateClicked);
        pairs.push({
          key: layer.values_.fKey,
          value: feature.values_.properties[layer.values_.fKey],
        });
      });

      this.setState(() => {
        return { pairs: pairs };
      });
    });
    this.setState({
      map: map,
      layers: {
        DTW: vectorLayerForDTW,
        WH: vectorLayerForWellHead,
        WD: vectorLayerForWllDepth,
        HC: vectorLayerForSpfCon,
        DD: vectorLayerForDD,
        PP: vectorLayerForPump,
      },
    });
  }

  render() {
    if (this.state.layers) {
      Object.values(this.state.layers).forEach((layer) => {
        layer.getSource().changed();
      });
    }
    let pairs = this.state.pairs;
    if (!pairs) pairs = [];
    if (this.state.map) {
      const map = this.state.map;
      ["DTW", "WH", "WD", "HC", "DD", "PP"].forEach((f) => {
        map.removeLayer(this.state.layers[f]);
        if (this.state.features[f] === true) {
          map.addLayer(this.state.layers[f]);
        }
      });
    }

    const drawerContent = (
      <>
        <AppBar position="static" style={{ background: "#2E3B55" }}>
          <Toolbar>
            <Typography variant="h6">Features</Typography>
          </Toolbar>
        </AppBar>

        <List className="myDrawer">
          <ListItem button key="k1">
            {this.getListItemIcon("DTW")}
            <ListItemText primary="DTW" />
            {this.state.features.DTW === true ? this.getPicker("DTW") : null}
          </ListItem>
          {this.state.colorPickerVisibility.DTW
            ? this.getPickerVisvibility("DTW")
            : null}

          <ListItem button key="k2">
            {this.getListItemIcon("WD")}
            <ListItemText primary="Well Depth" />
            {this.state.features.WD === true ? this.getPicker("WD") : null}
          </ListItem>
          {this.state.colorPickerVisibility.WD
            ? this.getPickerVisvibility("WD")
            : null}

          <ListItem button key="k3">
            {this.getListItemIcon("WH")}
            <ListItemText primary="Well Head" />
            {this.state.features.WH === true ? this.getPicker("WH") : null}
          </ListItem>
          {this.state.colorPickerVisibility.WH
            ? this.getPickerVisvibility("WH")
            : null}

          <ListItem button key="k4">
            {this.getListItemIcon("HC")}
            <ListItemText primary="Hydraulic Conductivity" />
            {this.state.features.HC === true ? this.getPicker("HC") : null}
          </ListItem>
          {this.state.colorPickerVisibility.HC
            ? this.getPickerVisvibility("HC")
            : null}

          <ListItem button key="k5">
            {this.getListItemIcon("DD")}
            <ListItemText primary="DD" />
            {this.state.features.DD === true ? this.getPicker("DD") : null}
          </ListItem>
          {this.state.colorPickerVisibility.DD
            ? this.getPickerVisvibility("DD")
            : null}

          <ListItem button key="k6">
            {this.getListItemIcon("PP")}
            <ListItemText primary="pump" />
            {this.state.features.PP === true ? this.getPicker("PP") : null}
          </ListItem>
          {this.state.colorPickerVisibility.PP
            ? this.getPickerVisvibility("PP")
            : null}
        </List>
      </>
    );

    return (
      <>
        <div className="controlPanel">{drawerContent}</div>

        <div style={{ position: "relative" }}>
          <Hidden xsDown>
            <div className="controlPanel">{drawerContent}</div>
          </Hidden>
          <Hidden smUp>
            <Drawer
              anchor="right"
              open={this.props.isDrawerOpen}
              variant="persistent"
              onClick={this.props.mapOnClick}
            >
              {drawerContent}

              <AppBar position="static" style={{ background: "#2E3B55" }}>
                <Toolbar>
                  <Typography variant="h6">Study Area</Typography>
                </Toolbar>
              </AppBar>
              <List className="myDrawer">
                <ListItem button key="k1">
                  <ListItemIcon>
                    <Checkbox
                      color="primary"
                      onClick={() => {
                        this.goToLocation("Turkey");
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="TAR" />
                </ListItem>
                <ListItem button key="k2">
                  <ListItemIcon>
                    <Checkbox
                      color="primary"
                      onClick={() => {
                        this.goToLocation("Germany");
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Germany" />
                </ListItem>
              </List>
            </Drawer>
          </Hidden>
        </div>

        <div id="map" onClick={this.toggleDrawer}></div>
        <div id="info" ref={this.infoRef}>
          <>
            {pairs.map((el) => {
              const key = el.key;
              const value = el.value;
              return (
                <>
                  <div>
                    <div
                      style={{
                        borderWidth: "1px",
                        borderColor: "white",
                        borderStyle: "solid",
                        borderRadius: "5px",
                        float: "left",
                        height: "10px",
                        width: "10px",
                        marginRight: "8px",
                        marginTop: "2px",
                        backgroundColor: this.state.colors[this.abbr(key)],
                      }}
                    >
                      {" "}
                    </div>
                    {key}: {value}
                  </div>
                  <br />
                </>
              );
            })}
          </>
        </div>
      </>
    );
  }
}

export default Turkey;
