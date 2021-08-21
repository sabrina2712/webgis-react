import React from "react";
import "ol/ol.css";
import Feature from "ol/Feature";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import { Circle, Point } from "ol/geom";
import { Tile as TileLayer, Vector as VectorLayer, Heatmap } from "ol/layer";
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
import { getCenter } from "ol/extent";
import { toStringHDMS } from "ol/coordinate";
import Pixel from "ol/pixel";
import "../App.css";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

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
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FadeMenu from "./fadeMenu";
import { SketchPicker } from "react-color";
import distData from "./distrct-ger.json";
import dataGer from "./germany.json";

import adddata from "./warswah-data.json";
import worldData from "./whole-world.json";
import outputData from "./output.json";
import dataTar from "./tarData.json";
import btd242data from "./BTD-242-geojson.json";
import btd2431data from "./BTD-2431-DRY-geojson.json";
import btd2432data from "./BTD-2432-wet-geohson.json";
import salento422data from "./salento_4_2_2 .json";
import salento432data from "./Salentro-x432-geojson.json";
import Navbar from "./NavBar/Navbar";

function getCenterOfExtent(Extent) {
  var X = Extent[0] + (Extent[2] - Extent[0]) / 2;
  var Y = Extent[1] + (Extent[3] - Extent[1]) / 2;
  return transform([X, Y], "EPSG:4326", "EPSG:3857");
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

class TurkeyService {
  constructor(reloadDataCallback, zoom) {
    this.reloadData = reloadDataCallback;
    this.zoom = zoom;
    this.data = dataTar.data;
    this.dataProperties = dataTar.properties;
    this.location = [34.82091, 36.815247];
    this.state = {
      checkedProperties: [],
      allOpenProperties: false,

      colorPickerVisibility: [],
      mapClick: false,
      selectedlocation: "none",
      drawerContent: null,
      showDrawer: null,

      colors: [getRandomColor()],

      map: this.map,
      view: this.view,
      isShowing: false,
      dtwIsChecked: false,
      wdIsChecked: false,
      whIsChecked: false,
      pumpIsChecked: false,
      ddIsChecked: false,
      spcIsChecked: false,
      width: "33%",

      isDtwOpen: false,
      isWdOpen: false,
      isWhOpen: false,
      isPumpOpen: false,
      isDDOpen: false,
      isSpcOpen: false,
      open: false,
    };
  }

  popupInfo = (features) =>
    features.map((el) => `${el.get("id")} : ${el.get("prop")}`);

  getPickerComponent = (v) => {
    console.log("get picker dtw");
    return (
      <div>
        <SketchPicker
          color={this.state.colors.v}
          onChange={(color) => {
            console.log("get picker dtw inside");
            this.changeFeatureColor(v, color);
            this.reloadData();
          }}
        />
      </div>
    );
  };

  toogleFeature = (f) => {
    this.state.checkedProperties.includes(f)
      ? (this.state.checkedProperties = this.state.checkedProperties.filter(
          (el) => el !== f
        ))
      : this.state.checkedProperties.push(f);
  };

  getData = () => {
    function makeFeature(el, prop, color, scale) {
      let style = new Style({
        image: new CircleStyle({
          radius: el[prop] * scale,
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({ color: color, width: 1 }),
        }),
      });
      return {
        type: "Feature",
        id: prop + el.id,
        properties: {
          id: prop + el.id,
          type: prop,
          prop: el[prop],
          style: style,
        },
        geometry: {
          type: "Point",
          coordinates: [el.Longitude, el.Lattitude],
        },
      };
    }

    console.log(this.state.colors);
    let allCheckedFeatures = [];

    const len = this.data.length;

    for (var i = 0; i < len; i++) {
      let el = this.data[i];

      const currentKeys = Object.keys(el);

      let keys = currentKeys.filter(
        (key) => !this.state.checkedProperties.includes(key)
      );
      keys.forEach((key) => {
        this.state.checkedProperties.push(
          makeFeature(el, key, this.state.colors, 1)
        );
      });
    }

    console.log(
      "==> allCheckedFeatures len " + this.state.checkedProperties.length
    );

    const geojsonObj = {
      type: "FeatureCollection",
      features: allCheckedFeatures,
    };

    // for pumping rate and drawdown

    return geojsonObj;
  };
  changeFeatureColor = (f, color) => {
    const colors = this.state.colors;
    colors[f] = color;

    return { colors: colors };
  };

  getStyleForFeature = (f) => {
    console.log("===", f.get("type"));
    return f.get("style");
  };
  getListItemIcon = (t) => {
    return (
      <ListItemIcon>
        <Checkbox
          checked={this.state.checkedProperties.includes(t)}
          color="primary"
          onChange={() => {
            this.toogleFeature(t);
            this.reloadData();
          }}
        />
      </ListItemIcon>
    );
  };

  pickerVisvibilityMethod = (t) => {
    let showCheckedPro = this.state.checkedProperties.map((property) => {
      if (property === t) {
        this.state.allOpenProperties = !this.state.allOpenProperties;
      }
    });

    this.reloadData();
  };

  getDrawer = () => {
    return (
      <Hidden smDown>
        <div id="feature-content" display={{ xs: "none", sm: "block" }}>
          <AppBar position="static" style={{ background: "#2E3B55" }}>
            <Toolbar>
              <Typography variant="h6">Features</Typography>
            </Toolbar>
          </AppBar>

          <List className="myDrawer">
            <ListItem button>
              {this.dataProperties.map((d) => {
                return (
                  <div>
                    {this.getListItemIcon(d)}

                    <div className="picker-turkey">
                      <div
                        onClick={() => this.pickerVisvibilityMethod(d)}
                        style={{
                          backgroundColor: this.state.colors,
                          height: "20px",
                          width: "20px",
                        }}
                      >
                        {d}
                      </div>
                    </div>
                  </div>
                );
              })}
            </ListItem>
            {this.state.isDtwOpen === true ? (
              <ListItem>{this.getPickerComponent("DTW")}</ListItem>
            ) : null}
          </List>
        </div>
      </Hidden>
    );
  };
  drawerContentDown = () => {
    return (
      <Hidden mdUp>
        <div id="feature-content-down" display={{ xs: "block", sm: "none" }}>
          <List className="myDrawerDown">
            <ListItem button key="k1" style={{ width: this.state.width }}>
              {this.getListItemIcon("DTW")}
              <ListItemText primary="DTW" />
            </ListItem>
            {this.state.colorPickerVisibility.DTW
              ? this.getPickerComponent("DTW")
              : null}

            <ListItem button key="k2" style={{ width: this.state.width }}>
              {this.getListItemIcon("WD")}
              <ListItemText primary="Well Depth" />
            </ListItem>
            {this.state.colorPickerVisibility.WD
              ? this.getPickerComponent("WD")
              : null}

            <ListItem button key="k3" style={{ width: this.state.width }}>
              {this.getListItemIcon("WH")}
              <ListItemText primary="Well Head" />
            </ListItem>

            <ListItem button key="k4" style={{ width: this.state.width }}>
              {this.getListItemIcon("SPC")}
              <ListItemText primary="Specific Capacity" />
            </ListItem>

            <ListItem button key="k5" style={{ width: this.state.width }}>
              {this.getListItemIcon("DD")}
              <ListItemText primary="DD" />
            </ListItem>

            <ListItem button key="k6" style={{ width: this.state.width }}>
              {this.getListItemIcon("PP")}
              <ListItemText primary="pump" />
            </ListItem>
          </List>
        </div>
      </Hidden>
    );
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
  onMapClick = (features) => {
    if (!features || !features.length || features.length < 1) return;
    features.forEach((el) => {});
  };
  drawerContent = () => {
    console.log("hello Turkey");
    return this.getDrawer();
  };
  getHeatLayerFeatures = () => {
    return null;
  };
}

class AlgeriaService {
  constructor(reloadDataCallback, zoom) {
    this.reloadData = reloadDataCallback;
    this.zoom = zoom;
    this.location = [8.124005581, 36.83574561];
    this.state = {
      colorPickerVisibility: {
        SPC: false,
        TMVT: false,
        HC: false,
        PiezometricL: false,
        z: false,
        PiezometricLWet: false,
        zWet: false,
      },
      mapClick: false,
      selectedlocation: "none",
      drawerContent: null,
      showDrawer: null,
      features: {
        SPC: false,
        TMVT: false,
        HC: false,
        PiezometricL: false,
        z: false,
        PiezometricLWet: false,
        zWet: false,
      },
      colors: {
        SPC: "rgba(255,0, 0, 0.7)",
        TMVT: "rgba(0, 128, 0, 0.7)",
        HC: "rgb(56, 31, 65, 0.7)",
        PiezometricL: "rgba(201, 224, 50, 0.8)",
        z: "rgb(19, 17, 250,0.6)",
        PiezometricLWet: "rgb(179, 167, 228,.9)",
        zWet: "rgba(201, 100, 20, 0.8)",
      },

      map: this.map,
      view: this.view,
      isShowing: false,
      SPCIsChecked: false,
      TMVTIsChecked: false,
      HCIsChecked: false,
      PiezometricLIsChecked: false,
      ZIsChecked: false,
      PiezometricLWetIsChecked: false,
      ZWetIsChecked: false,

      width: "33%",

      isSPCOpen: false,
      isTMVTOpen: false,
      isHCOpen: false,

      open: false,
    };
  }
  getData = () => {
    function makeFeature(el, prop, color, scale) {
      console.log("makefeature: " + prop + "=" + el[prop]);
      let style = new Style({
        image: new CircleStyle({
          radius: el[prop] * scale,
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({ color: color, width: 1 }),
        }),
      });
      return {
        type: "Feature",
        id: prop + el.id,
        properties: {
          id: prop + el.id,
          type: prop,
          prop: el[prop],
          style: style,
        },
        geometry: {
          type: "Point",
          coordinates: [el.Longitude, el.Lattitude],
        },
      };
    }
    let allCheckedFeatures = [];
    console.log(btd242data);
    const len = btd242data.length;
    const len1 = btd2431data.length;
    const len2 = btd2432data.length;

    for (var i = 0; i < len; i++) {
      let el = btd242data[i];

      if (this.state.SPCIsChecked) {
        console.log("adding SPC");
        allCheckedFeatures.push(
          makeFeature(el, "SPC", this.state.colors["SPC"], 3000)
        );
      }

      if (this.state.TMVTIsChecked) {
        console.log("adding Transmissivity");
        allCheckedFeatures.push(
          makeFeature(el, "TMVT", this.state.colors["TMVT"], 3000)
        );
      }

      if (this.state.HCIsChecked) {
        console.log("adding HC");
        allCheckedFeatures.push(
          makeFeature(el, "HC", this.state.colors["HC"], 50000)
        );
      }
    }

    for (var i = 0; i < len1; i++) {
      let el = btd2431data[i];

      if (this.state.PiezometricLIsChecked) {
        console.log("adding PiezometricL");
        allCheckedFeatures.push(
          makeFeature(el, "PiezometricL", this.state.colors["PiezometricL"], 1)
        );
      }
      if (this.state.ZIsChecked) {
        console.log("adding z");
        allCheckedFeatures.push(
          makeFeature(el, "z", this.state.colors["z"], 1)
        );
      }
    }

    for (var i = 0; i < len2; i++) {
      let el = btd2432data[i];

      if (this.state.PiezometricLWetIsChecked) {
        console.log("adding PiezometricLWet");
        allCheckedFeatures.push(
          makeFeature(
            el,
            "PiezometricLWet",
            this.state.colors["PiezometricLWet"],
            1
          )
        );
      }
      if (this.state.ZWetIsChecked) {
        console.log("adding zWet");
        allCheckedFeatures.push(
          makeFeature(el, "zWet", this.state.colors["zWet"], 1)
        );
      }
    }

    const geojsonObj = {
      type: "FeatureCollection",
      features: allCheckedFeatures,
    };

    console.log(geojsonObj);
    return geojsonObj;
  };

  drawerContent = () => {
    console.log("hello Algeria");
    return this.getDrawer();
  };

  getDrawer = () => {
    return (
      <Hidden smDown>
        <div id="feature-content" display={{ xs: "none", sm: "block" }}>
          <AppBar position="static" style={{ background: "#2E3B55" }}>
            <Toolbar>
              <Typography variant="h6">Features</Typography>
            </Toolbar>
          </AppBar>

          <List className="myDrawer">
            <ListItem button key="k1">
              {this.getListItemIcon("SPC")}

              <ListItemText primary="SPC" />

              <div className="picker-algeria">
                <div
                  onClick={() => this.pickerVisvibilityMethod("SPC")}
                  style={{
                    backgroundColor: this.state.colors["SPC"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.colorPickerVisibility.SPC ? (
              <ListItem>{this.getPickerComponent("SPC")}</ListItem>
            ) : null}
            <ListItem button key="k2">
              {this.getListItemIcon("TMVT")}
              <ListItemText primary="TMVT" />

              <div className="picker-algeria">
                <div
                  onClick={() => this.pickerVisvibilityMethod("TMVT")}
                  style={{
                    backgroundColor: this.state.colors["TMVT"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.colorPickerVisibility.TWBT ? (
              <ListItem>{this.getPickerComponent("TMVT")}</ListItem>
            ) : null}
            <ListItem button key="k3">
              {this.getListItemIcon("HC")}
              <ListItemText primary="HC" />

              <div className="picker-algeria">
                <div
                  onClick={() => this.pickerVisvibilityMethod("HC")}
                  style={{
                    backgroundColor: this.state.colors["HC"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.colorPickerVisibility.HC ? (
              <ListItem>{this.getPickerComponent("HC")}</ListItem>
            ) : null}

            <ListItem button key="k4">
              {this.getListItemIcon("PiezometricL")}

              <ListItemText primary="PiezometricL" />

              <div className="picker-algeria">
                <div
                  onClick={() => this.pickerVisvibilityMethod("PiezometricL")}
                  style={{
                    backgroundColor: this.state.colors["PiezometricL"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.colorPickerVisibility.SPC ? (
              <ListItem>{this.getPickerComponent("PiezometricL")}</ListItem>
            ) : null}

            <ListItem button key="k5">
              {this.getListItemIcon("z")}

              <ListItemText primary="z" />

              <div className="picker-algeria">
                <div
                  onClick={() => this.pickerVisvibilityMethod("z")}
                  style={{
                    backgroundColor: this.state.colors["z"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.colorPickerVisibility.SPC ? (
              <ListItem>{this.getPickerComponent("z")}</ListItem>
            ) : null}

            <ListItem button key="k6">
              {this.getListItemIcon("zWet")}
              <ListItemText primary="zWet" />

              <div className="picker-algeria">
                <div
                  onClick={() => this.pickerVisvibilityMethod("zWet")}
                  style={{
                    backgroundColor: this.state.colors["zWet"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.colorPickerVisibility.zWet ? (
              <ListItem>{this.getPickerComponent("zWet")}</ListItem>
            ) : null}

            <ListItem button key="k7">
              {this.getListItemIcon("PiezometricLWet")}
              <ListItemText primary="PiezometricLWet" />

              <div className="picker-algeria">
                <div
                  onClick={() =>
                    this.pickerVisvibilityMethod("PiezometricLWet")
                  }
                  style={{
                    backgroundColor: this.state.colors["PiezometricLWet"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.colorPickerVisibility.PiezometricLWet ? (
              <ListItem>{this.getPickerComponent("PiezometricLWet")}</ListItem>
            ) : null}
          </List>
        </div>
      </Hidden>
    );
  };

  getPickerComponent = (v) => {
    console.log("get picker SPC");
    return (
      <div>
        <SketchPicker
          color={this.state.colors.v}
          onChange={(color) => {
            console.log("get picker dtw inside");
            this.changeFeatureColor(v, color.hex);
            this.reloadData();
          }}
        />
      </div>
    );
  };
  changeFeatureColor = (f, color) => {
    const colors = this.state.colors;
    colors[f] = color;
    console.log(color);
    console.log(colors);
    return { colors: colors };
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
  getListItemIcon = (t) => {
    return (
      <ListItemIcon>
        <Checkbox
          checked={this.state.features.t}
          color="primary"
          onChange={() => {
            if (t === "SPC") {
              this.state.SPCIsChecked = !this.state.SPCIsChecked;
            }
            if (t === "TMVT") {
              this.state.TMVTIsChecked = !this.state.TMVTIsChecked;
            }
            if (t === "HC") {
              this.state.HCIsChecked = !this.state.HCIsChecked;
            }
            if (t === "PiezometricL") {
              this.state.PiezometricLIsChecked =
                !this.state.PiezometricLIsChecked;
            }
            if (t === "z") {
              this.state.ZIsChecked = !this.state.ZIsChecked;
            }

            if (t === "zWet") {
              this.state.ZWetIsChecked = !this.state.ZWetIsChecked;
            }

            if (t === "PiezometricLWet") {
              this.state.PiezometricLWetIsChecked =
                !this.state.PiezometricLWetIsChecked;
            }

            this.reloadData();
          }}
        />
      </ListItemIcon>
    );
  };
  drawerContentDown = () => {
    return (
      <Hidden mdUp>
        <div id="feature-content-down" display={{ xs: "block", sm: "none" }}>
          <AppBar position="static" style={{ background: "#2E3B55" }}>
            <Toolbar>
              <Typography variant="h6">Features</Typography>
            </Toolbar>
          </AppBar>

          <List className="myDrawerDown">
            <ListItem button key="k1" style={{ width: this.state.width }}>
              {this.getListItemIcon("SPC")}
              <ListItemText primary="SPC" />
            </ListItem>
            {this.state.colorPickerVisibility.SPC
              ? this.getPickerComponent("SPC")
              : null}

            <ListItem button key="k2" style={{ width: this.state.width }}>
              {this.getListItemIcon("TMVT")}
              <ListItemText primary="TMVT" />
            </ListItem>
            {this.state.colorPickerVisibility.TMVT
              ? this.getPickerComponent("TMVT")
              : null}

            <ListItem button key="k3" style={{ width: this.state.width }}>
              {this.getListItemIcon("HC")}
              <ListItemText primary="HC" />
            </ListItem>
            {this.state.colorPickerVisibility.HC
              ? this.getPickerComponent("HC")
              : null}

            <ListItem button key="k4" style={{ width: this.state.width }}>
              {this.getListItemIcon("PiezometricL")}
              <ListItemText primary="PiezometricL" />
            </ListItem>
            {this.state.colorPickerVisibility.PiezometricL
              ? this.getPickerComponent("PiezometricL")
              : null}

            <ListItem button key="k5" style={{ width: this.state.width }}>
              {this.getListItemIcon("z")}
              <ListItemText primary="z" />
            </ListItem>
            {this.state.colorPickerVisibility.z
              ? this.getPickerComponent("z")
              : null}

            <ListItem button key="k6" style={{ width: this.state.width }}>
              {this.getListItemIcon("zWet")}
              <ListItemText primary="zWet" />
            </ListItem>
            {this.state.colorPickerVisibility.zWet
              ? this.getPickerComponent("zWet")
              : null}

            <ListItem button key="k7" style={{ width: this.state.width }}>
              {this.getListItemIcon("PiezometricLWet")}
              <ListItemText primary="PiezometricLWet" />
            </ListItem>
            {this.state.colorPickerVisibility.PiezometricLWet
              ? this.getPickerComponent("PiezometricLWet")
              : null}
          </List>
        </div>
      </Hidden>
    );
  };

  getStyleForFeature = (f) => {
    console.log("===", f.get("type"));
    return f.get("style");
  };
  getHeatLayerFeatures = () => {
    return null;
  };
  onMapClick = (features) => {
    if (!features || !features.length || features.length < 1) return;
    features.forEach((el) => {});
  };
  popupInfo = (features) =>
    features.map((el) => ` ${el.get("id")} : ${el.get("prop")}, `);
}

class SalentoService {
  constructor(reloadDataCallback, zoom) {
    this.reloadData = reloadDataCallback;
    this.zoom = 10;
    this.location = [18.23093175, 40.25405969];
    this.state = {
      colorPickerVisibility: {
        SPC: false,
        PiezometricL: false,
      },
      features: {
        SPC: false,
        PiezometricL: false,
      },
      mapClick: false,
      selectedlocation: "none",
      drawerContent: null,
      showDrawer: null,
      features: {
        SPC: false,
        PiezometricL: false,
      },
      colors: {
        SPC: "rgba(10, 0, 49, 0.8)",
        PiezometricL: "rgba(118, 17, 25, 0.6)",
      },

      map: this.map,
      view: this.view,
      isShowing: false,

      SPCIsChecked: false,
      PiezometricLIsChecked: false,

      width: "33%",

      isSPCOpen: false,
      open: false,
    };
  }

  getData = () => {
    function makeFeature(i, el, prop, color, scale) {
      let style = new Style({
        image: new CircleStyle({
          radius: el.properties[prop] * scale,
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({ color: color, width: 1 }),
        }),
      });
      return {
        type: "Feature",
        id: prop + i,
        properties: {
          id: prop,
          type: prop,
          prop: el.properties[prop],
          style: style,
        },
        geometry: {
          type: "Point",
          coordinates: el.geometry.coordinates,
        },
      };
    }
    let allCheckedFeatures = [];
    const len = salento422data.length;

    for (var i = 0; i < len; i++) {
      let el = salento422data[i];

      if (this.state.SPCIsChecked) {
        allCheckedFeatures.push(
          makeFeature(
            i,
            el,
            "Specific capacity [l/(s*m)]",
            this.state.colors["SPC"],
            0.01
          )
        );
      }
    }

    function makeFeature2(el, prop, color, scale) {
      let style = new Style({
        image: new CircleStyle({
          radius: el[prop] * scale,
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({ color: color, width: 1 }),
        }),
      });
      return {
        type: "Feature",
        id: prop + el.id,
        properties: {
          id: prop + el.id,
          type: prop,
          prop: el[prop],
          style: style,
        },
        geometry: {
          type: "Point",
          coordinates: [el.Longitude, el.Lattitude],
        },
      };
    }
    const len1 = salento432data.length;

    for (var i = 0; i < len1; i++) {
      let el1 = salento432data[i];

      if (this.state.PiezometricLIsChecked) {
        allCheckedFeatures.push(
          makeFeature2(
            el1,
            "Piezometric level (a.m.s.l.)",
            this.state.colors["PiezometricL"],
            10
          )
        );
      }
    }

    console.log("==> allCheckedFeatures len " + allCheckedFeatures.length);

    const geojsonObj = {
      type: "FeatureCollection",
      features: allCheckedFeatures,
    };

    console.log(geojsonObj);
    return geojsonObj;
  };

  drawerContent = () => {
    console.log("hello Salento");
    return this.getDrawer();
  };

  getDrawer = () => {
    return (
      <Hidden smDown>
        <div id="feature-content" display={{ xs: "none", sm: "block" }}>
          <AppBar position="static" style={{ background: "#2E3B55" }}>
            <Toolbar>
              <Typography variant="h6">Features</Typography>
            </Toolbar>
          </AppBar>

          <List className="myDrawer">
            <ListItem button key="k1">
              {this.getListItemIcon("SPC")}

              <ListItemText primary="SPC" />

              <div className="picker-algeria">
                <div
                  onClick={() => this.pickerVisvibilityMethod("SPC")}
                  style={{
                    backgroundColor: this.state.colors["SPC"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            <ListItem button key="k2">
              {this.getListItemIcon("PiezometricL")}

              <ListItemText primary="PiezometricL" />

              <div className="picker-algeria">
                <div
                  onClick={() => this.pickerVisvibilityMethod("PiezometricL")}
                  style={{
                    backgroundColor: this.state.colors["PiezometricL"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>

            {this.state.colorPickerVisibility.SPC ? (
              <ListItem>{this.getPickerComponent("SPC")}</ListItem>
            ) : null}

            {this.state.colorPickerVisibility.PiezometricL ? (
              <ListItem>{this.getPickerComponent("PiezometricL")}</ListItem>
            ) : null}
          </List>
        </div>
      </Hidden>
    );
  };

  getPickerComponent = (v) => {
    console.log("get picker SPC");
    return (
      <div>
        <SketchPicker
          color={this.state.colors.v}
          onChange={(color) => {
            this.changeFeatureColor(v, color.hex);
            this.reloadData();
          }}
        />
      </div>
    );
  };
  changeFeatureColor = (f, color) => {
    const colors = this.state.colors;
    colors[f] = color;
    console.log(color);
    console.log(colors);
    return { colors: colors };
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
  getListItemIcon = (t) => {
    return (
      <ListItemIcon>
        <Checkbox
          checked={this.state.features.t}
          color="primary"
          onChange={() => {
            if (t === "SPC") {
              this.state.SPCIsChecked = !this.state.SPCIsChecked;
            }
            if (t === "PiezometricL") {
              this.state.PiezometricLIsChecked =
                !this.state.PiezometricLIsChecked;
            }
            this.reloadData();
          }}
        />
      </ListItemIcon>
    );
  };
  drawerContentDown = () => {
    return (
      <Hidden mdUp>
        <div id="feature-content-down" display={{ xs: "block", sm: "none" }}>
          <List className="myDrawerDown">
            <ListItem button key="k1" style={{ width: this.state.width }}>
              {this.getListItemIcon("SPC")}
              <ListItemText primary="SPC" />
            </ListItem>
            {this.state.colorPickerVisibility.SPC
              ? this.getPickerComponent("SPC")
              : null}
          </List>
        </div>
      </Hidden>
    );
  };

  getStyleForFeature = (f) => {
    console.log("===", f, f.get("style"));
    return f.get("style");
  };
  getHeatLayerFeatures = () => {
    return null;
  };
  onMapClick = (features) => {
    if (!features || !features.length || features.length < 1) return;
    features.forEach((el) => {});
  };
  popupInfo = (features) =>
    features.map((el) => ` ${el.get("id")} : ${el.get("prop")}, `);

  pickerVisvibilityMethod = (t) => {
    if (t === "SPC") {
      this.state.isSPCOpen = !this.state.isSPCOpen;
    }
    if (t === "PiezometricL") {
      this.state.isSPCOpen = !this.state.isSPCOpen;
    }
  };
}

class GermanyService {
  constructor(reloadDataCallback) {
    this.reloadData = reloadDataCallback;
    this.zoom = 5.5;
    this.location = [10.202057, 52.520008];
    this.showingState = true;
    this.state = {
      stateRevenue: {
        "DE-BB": 5627,
        "DE-BE": 5500,
        "DE-BW": 3231,
        "DE-BY": 1813,
        "DE-HB": 9792,
        "DE-HE": 4538,
        "DE-HH": 2883,
        "DE-MV": 9752,
        "DE-NI": 5550,
        "DE-NW": 282,
        "DE-RP": 1469,
        "DE-SH": 9673,
        "DE-SL": 7858,
        "DE-SN": 3835,
        "DE-ST": 3852,
        "DE-TH": 4264,
      },
      distRev: {
        0: 824,
        1: 3176,
        2: 2578,
        3: 2014,
        4: 2673,
        5: 3503,
        6: 3226,
        7: 2074,
        8: 2446,
        9: 964,
        10: 2436,
        11: 1625,
        12: 2795,
        13: 1717,
        14: 2323,
        15: 3825,
        16: 783,
        17: 2702,
        18: 3877,
        19: 3246,
        20: 727,
        21: 1605,
        22: 3144,
        23: 894,
        24: 1232,
        25: 514,
        26: 3401,
        27: 681,
        28: 3040,
        29: 1411,
        30: 456,
        31: 694,
        32: 1056,
        33: 1507,
        34: 1124,
        35: 164,
        36: 1558,
        37: 1086,
        38: 687,
        39: 2197,
        40: 3077,
        41: 1662,
        42: 373,
        43: 3916,
        44: 3282,
        45: 2399,
        46: 645,
        47: 1676,
        48: 122,
        49: 3275,
        50: 763,
        51: 182,
        52: 89,
        53: 36,
        54: 2907,
        55: 12,
        56: 2976,
        57: 2565,
        58: 3038,
        59: 1098,
        60: 251,
        61: 1562,
        62: 3255,
        63: 55,
        64: 3872,
        65: 3471,
        66: 1841,
        67: 715,
        68: 2192,
        69: 2396,
        70: 3580,
        71: 1660,
        72: 982,
        73: 1077,
        74: 991,
        75: 3210,
        76: 1505,
        77: 1458,
        78: 2254,
        79: 282,
        80: 2801,
        81: 864,
        82: 3303,
        83: 1614,
        84: 3239,
        85: 1818,
        86: 2361,
        87: 2152,
        88: 3509,
        89: 1677,
        90: 522,
        91: 3176,
        92: 972,
        93: 2701,
        94: 59,
        95: 2101,
        96: 3121,
        97: 831,
        98: 369,
        99: 337,
        100: 568,
        101: 1095,
        102: 3035,
        103: 2823,
        104: 3187,
        105: 2953,
        106: 3958,
        107: 598,
        108: 236,
        109: 2259,
        110: 1999,
        111: 3684,
        112: 3794,
        113: 2744,
        114: 1742,
        115: 3864,
        116: 3953,
        117: 1028,
        118: 2263,
        119: 798,
        120: 2879,
        121: 3076,
        122: 645,
        123: 821,
        124: 3679,
        125: 3234,
        126: 3088,
        128: 258,
        129: 1370,
        130: 1589,
        131: 3877,
        132: 113,
        133: 322,
        134: 2664,
        135: 3224,
        136: 1118,
        137: 1853,
        138: 1859,
        139: 568,
        140: 3172,
        141: 2413,
        142: 2915,
        143: 2286,
        144: 1088,
        145: 421,
        146: 1364,
        147: 1580,
        148: 2696,
        149: 1076,
        150: 2242,
        151: 1465,
        152: 659,
        153: 862,
        154: 3445,
        155: 782,
        156: 2042,
        157: 3357,
        158: 79,
        159: 2712,
        160: 2252,
        161: 42,
        162: 871,
        163: 1457,
        164: 1840,
        165: 3321,
        166: 1677,
        167: 3502,
        168: 2476,
        169: 2945,
        170: 1068,
        171: 3847,
        172: 3224,
        173: 3807,
        174: 2416,
        175: 665,
        176: 186,
        177: 931,
        178: 1358,
        179: 1538,
        180: 3048,
        181: 804,
        182: 1904,
        183: 717,
        184: 1312,
        185: 2509,
        186: 3494,
        187: 2474,
        188: 855,
        189: 1232,
        190: 1272,
        191: 1462,
        192: 1481,
        193: 3824,
        194: 1041,
        195: 1259,
        196: 1138,
        197: 1772,
        198: 2596,
        199: 2086,
        200: 1001,
        201: 3571,
        202: 1730,
        203: 955,
        204: 106,
        205: 1490,
        206: 1499,
        207: 2908,
        208: 1502,
        209: 1617,
        210: 773,
        211: 3081,
        212: 3026,
        213: 3967,
        214: 1328,
        215: 3035,
        216: 1645,
        217: 829,
        218: 336,
        219: 907,
        220: 2003,
        221: 3630,
        222: 3235,
        223: 1549,
        224: 2770,
        225: 1129,
        226: 1432,
        227: 877,
        228: 3408,
        229: 2142,
        230: 1573,
        231: 903,
        232: 2800,
        233: 3458,
        234: 3511,
        235: 1066,
        236: 910,
        237: 2945,
        238: 372,
        239: 3196,
        240: 333,
        241: 178,
        242: 279,
        243: 2856,
        244: 1410,
        245: 2048,
        246: 95,
        247: 2921,
        248: 341,
        249: 58,
        250: 2777,
        251: 3419,
        252: 3947,
        253: 1989,
        254: 2862,
        255: 2286,
        256: 788,
        257: 433,
        258: 634,
        259: 2337,
        260: 2349,
        261: 2220,
        262: 841,
        263: 1344,
        264: 3186,
        265: 2784,
        266: 722,
        267: 167,
        268: 1356,
        269: 228,
        270: 2081,
        271: 1495,
        272: 81,
        273: 1366,
        274: 1303,
        275: 949,
        276: 2295,
        277: 2339,
        278: 1958,
        279: 861,
        280: 1573,
        281: 3035,
        282: 2752,
        283: 2338,
        284: 3123,
        285: 1765,
        286: 3412,
        287: 1145,
        288: 3403,
        289: 1288,
        290: 1673,
        291: 1148,
        292: 2908,
        293: 2914,
        294: 2080,
        295: 385,
        296: 53,
        297: 2575,
        298: 3902,
        299: 154,
        300: 2950,
        301: 2776,
        302: 3292,
        303: 1653,
        304: 2496,
        305: 3727,
        306: 1108,
        307: 2156,
        308: 1943,
        309: 3480,
        310: 2625,
        311: 3092,
        312: 3637,
        313: 3592,
        314: 3251,
        315: 2983,
        316: 3177,
        317: 2401,
        318: 3149,
        319: 709,
        320: 3814,
        321: 2317,
        322: 509,
        323: 3955,
        324: 2009,
        325: 1667,
        326: 3052,
        327: 718,
        328: 2085,
        329: 1286,
        330: 1489,
        331: 929,
        332: 946,
        333: 75,
        334: 1832,
        335: 3771,
        336: 1254,
        337: 1242,
        338: 1043,
        339: 1963,
        340: 2596,
        341: 3956,
        342: 3271,
        343: 3350,
        344: 948,
        345: 1504,
        346: 1104,
        347: 1156,
        348: 2758,
        349: 3768,
        350: 3384,
        351: 2130,
        352: 188,
        353: 1569,
        354: 695,
        355: 3995,
        356: 1274,
        357: 1031,
        358: 2626,
        359: 1228,
        360: 3734,
        361: 80,
        362: 718,
        363: 2300,
        364: 3123,
        365: 3337,
        366: 1282,
        367: 1613,
        368: 170,
        369: 3100,
        370: 3711,
        371: 2527,
        372: 2447,
        373: 1957,
        374: 594,
        375: 513,
        376: 924,
        377: 2088,
        378: 3539,
        379: 1152,
        380: 2504,
        381: 3762,
        382: 1299,
        383: 1445,
        384: 1105,
        385: 922,
        386: 2050,
        387: 1012,
        388: 1890,
        389: 1573,
        390: 1923,
        391: 3892,
        392: 3987,
        393: 1575,
        394: 2324,
        395: 2556,
        396: 2795,
        397: 3373,
        398: 2179,
        399: 297,
        400: 944,
        401: 819,
        402: 2752,
        403: 985,
        404: 921,
        405: 3651,
        406: 3477,
        407: 3623,
        408: 462,
        409: 171,
        410: 2247,
        411: 1187,
        412: 3356,
        413: 3002,
        414: 281,
        415: 3876,
        416: 2364,
        417: 2281,
        418: 3674,
        419: 3625,
        420: 1628,
        421: 2543,
        422: 1680,
        423: 985,
        424: 137,
        425: 1267,
        426: 571,
        427: 1291,
        428: 3571,
        429: 1889,
        430: 3867,
        431: 1445,
        432: 2049,
        433: 1307,
      },
    };
  }

  popupInfo = (features) =>
    features.map((el) => `${el.get("name")} : ${el.get("reve")}`);

  drawerContent = () => {
    console.log("hello Germany");
    return <div>{this.getLegend()}</div>;
  };
  getData = () =>
    this.showingState === true ? this.getStateData() : this.getDistData();

  getStateData = () => {
    dataGer.features.forEach((f) => {
      const stateOfThisFeature = f.properties["id"];
      const revenueForThisDist = this.state.stateRevenue[stateOfThisFeature];
      f.properties["reve"] = revenueForThisDist;
    });
    return dataGer;
  };

  getDistData = () => {
    let currState = this.stateId;
    console.log(currState);
    let data = JSON.parse(JSON.stringify(distData));
    let features = data.features
      .filter((f) => {
        const stateName = f.properties.NAME_1;
        return currState === stateName;
      })
      .map((f) => {
        const stateOfThisFeature = f["id"];
        const revenueForThisDist = this.state.distRev[stateOfThisFeature];
        f.properties["reve"] = revenueForThisDist;
        return f;
      });

    let states = this.getStateData();
    let filteredStates = states.features.filter((f) => {
      f.id = f.id + 100000;
      const stateOfThisFeature = f.properties["name"];
      return stateOfThisFeature != currState;
    });
    data.features = features.concat(filteredStates);
    console.log("in dist data", filteredStates);
    return data;
  };

  isFeatureState = (f) => {
    const stateId = f.get("name");
    if (stateId) return stateId;
    return false;
  };

  getStyleForFeature = (f) => {
    let rev = f.get("reve");

    return new Style({
      stroke: new Stroke({
        width: 2,
      }),
      fill: new Fill({
        color: this.getColor(rev),
      }),
    });
  };

  onMapClick = (features) => {
    if (!features || !features.length || features.length < 1) return;
    console.log(features);
    if (this.stateId) {
      const stateId = features.map((e) => e.get("name"));
      console.log(stateId);
      this.stateId = stateId;
    }
    console.log(this.showingState);
    if (this.showingState === true) {
      this.showingState = false;
    }

    // getting legend
    let legend = this.getLegend();
    if (this.stateId) return legend;
  };

  getLegendColor = (d) => {
    console.log("hello coclor");
    return d > 6000
      ? "#800026"
      : d > 5000
      ? "#BD0026"
      : d > 4000
      ? "#E31A1C"
      : d > 3000
      ? "#FC4E2A"
      : d > 2000
      ? "#FD8D3C"
      : d > 1000
      ? "#FEB24C"
      : d > 500
      ? "#FED976"
      : "#FFEDA0";
  };
  getLegend = () => {
    return (
      <Hidden smDown>
        <div id="legend" display={{ xs: "none", sm: "block" }}>
          <AppBar position="static" style={{ background: "#2E3B55" }}>
            <Toolbar>
              <Typography variant="h6">Legend</Typography>
            </Toolbar>
          </AppBar>
          <List>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(1000),
              }}
            >
              <span className="legend-span">{">"}1000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(2000),
              }}
            >
              <span className="legend-span">{">"}2000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(3000),
              }}
            >
              <span className="legend-span">{">"}3000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(5000),
              }}
            >
              <span className="legend-span">{">"}5000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(6000),
              }}
            >
              <span className="legend-span">{">"}6000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(9000),
              }}
            >
              <span className="legend-span">{">"}8000</span>
            </div>
          </List>
        </div>
      </Hidden>
    );
  };
  getColor = (d) => {
    return d > 6000
      ? "#800026"
      : d > 5000
      ? "#BD0026"
      : d > 4000
      ? "#E31A1C"
      : d > 3000
      ? "#FC4E2A"
      : d > 2000
      ? "#FD8D3C"
      : d > 1000
      ? "#FEB24C"
      : d > 500
      ? "#FED976"
      : "#FFEDA0";
  };
  drawerContentDown = () => {
    return (
      <Hidden mdUp>
        <div id="feature-content-down" display={{ xs: "block", sm: "none" }}>
          <List className="myDrawerDown">
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(1000),
              }}
            >
              <span className="legend-span">{">"}1000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(2000),
              }}
            >
              <span className="legend-span">{">"}2000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(3000),
              }}
            >
              <span className="legend-span">{">"}3000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(5000),
              }}
            >
              <span className="legend-span">{">"}5000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(6000),
              }}
            >
              <span className="legend-span">{">"}6000</span>
            </div>
            <div
              style={{
                width: "20px",
                height: "20px",
                marginLeft: "20px",
                backgroundColor: this.getLegendColor(9000),
              }}
            >
              <span className="legend-span">{">"}8000</span>
            </div>
          </List>
        </div>
      </Hidden>
    );
  };

  getHeatLayerFeatures = () => {
    return null;
  };
}

class Kazakhstan {
  constructor(reloadDataCallback) {
    this.reloadData = reloadDataCallback;
    this.location = [60.997972, 47.319778];
    this.zoom = 5.5;
    this.state = {
      blur: parseInt(2),
      radius: parseInt(5),
    };
  }

  getHeatLayerFeatures = () => {
    //addfeature
    const convertCoordinates = (lon, lat) => {
      var x = (lon * 20037508.34) / 180;
      var y =
        Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
      y = (y * 20037508.34) / 180;
      return [x, y];
    };

    let features = [];
    for (var i = 0; i < adddata.length; i++) {
      const xy = convertCoordinates(adddata[i][1], adddata[i][0]);
      var feature = new Feature({
        geometry: new Point(xy),
      });

      features.push(feature);
    }
    return features;
  };

  drawerContent = (heatlayer) => {
    console.log("hello kazak");
    console.log(heatlayer);

    return (
      <>
        <div id="feature-content" display={{ xs: "none", sm: "block" }}>
          <label>Blur size</label>
          <input
            onChange={(e) => {
              heatlayer.setRadius(parseInt(e.target.value, 10));
              this.reloadData();
            }}
            id="blur"
            type="range"
            min="1"
            max="50"
            value={this.state.blur}
            step="1"
          />
          <br></br>
          <label>Radius size</label>
          <input
            onChange={(e) => {
              this.state.radius = parseInt(e.target.value, 10);
              console.log(heatlayer);
              heatlayer.setRadius(parseInt(e.target.value, 10));
              this.reloadData();
            }}
            id="radius"
            type="range"
            min="1"
            max="50"
            value={this.state.radius}
            step="1"
          />
        </div>
      </>
    );
  };

  drawerContentDown = () => {
    return null;
  };

  getData = () => {
    return null;
  };
  getListItemIcon = () => {
    return null;
  };
  onMapClick = (features) => {
    if (!features || !features.length || features.length < 1) return;
    features.forEach((el) => {});
  };
  popupInfo = (features) =>
    features.map((el) => ` ${el.get("id")} : ${el.get("prop")}`);
}

class WholeWorldService {
  constructor(reloadDataCallback, zoom) {
    this.reloadData = reloadDataCallback;
    this.location = [0, 0];
    this.zoom = zoom;
    this.state = {
      mapClick: false,
      selectedlocation: "none",
      drawerContent: null,
      showDrawer: null,
      features: {
        DTW: false,
        WD: false,
        WH: false,
        SPC: false,
        PP: false,
        DD: false,
        PiezometricL: false,
        z: false,
        zWet: false,
        PiezometricLWet: false,
      },
      colors: {
        DTW: "rgba(255,0, 0, 0.3)",
        WD: "rgba(0, 128, 0, 0.9)",
        WH: "rgba(102, 153, 102, 0.7)",
        SPC: "rgba(201, 224, 50, 0.8)",
        PP: "rgba(237,53,145,0.7)",
        DD: "rgba(53,145, 237,0.7)",

        TMVT: "rgba(201, 224, 50, 0.8)",
        HC: "rgba(237,53,145,0.7)",
        PiezometricL: "rgba(200,53,15,0.7)",
        z: "rgba(200,0,215,0.7)",
        PiezometricLWet: "rgba(220, 24, 50, 0.8)",
        zWet: "rgba(201, 100, 20, 0.8)",
      },
      map: this.map,
      view: this.view,
      isShowing: false,
      width: "33%",
      open: false,
    };
  }

  getData = () => {
    function makeFeature(el, prop, color, scale) {
      let style = new Style({
        image: new CircleStyle({
          radius: el[prop] * scale,
          fill: new Fill({
            color: color,
          }),
          stroke: new Stroke({ color: color, width: 1 }),
        }),
      });
      return {
        type: "Feature",
        id: prop + el.id,
        properties: {
          id: prop + el.id,
          type: prop,
          prop: el[prop],
          style: style,
        },
        geometry: {
          type: "Point",
          coordinates: [el.Longitude, el.Lattitude],
        },
      };
    }
    let allCheckedFeatures = [];
    const len = worldData.length;

    for (var i = 0; i < len; i++) {
      let el = worldData[i];

      allCheckedFeatures.push(
        makeFeature(el, "DTW", this.state.colors["DTW"], 0.1)
      );

      allCheckedFeatures.push(
        makeFeature(el, "Well_depth", this.state.colors["WD"], 0.3)
      );

      allCheckedFeatures.push(
        makeFeature(el, "Wellhead", this.state.colors["WH"], 1)
      );

      allCheckedFeatures.push(
        makeFeature(el, "Specific_capacity", this.state.colors["SPC"], 0.1)
      );

      allCheckedFeatures.push(
        makeFeature(el, "Pumping_m3", this.state.colors["PP"], 3)
      );

      allCheckedFeatures.push(
        makeFeature(el, "Drawdown_m", this.state.colors["DD"], 0.7)
      );

      allCheckedFeatures.push(
        makeFeature(el, "SPC", this.state.colors["SPC"], 3000)
      );
      allCheckedFeatures.push(
        makeFeature(el, "TMVT", this.state.colors["TMVT"], 3000)
      );

      allCheckedFeatures.push(
        makeFeature(el, "HC", this.state.colors["HC"], 5000)
      );

      allCheckedFeatures.push(
        makeFeature(el, "PiezometricL", this.state.colors["PiezometricL"], 200)
      );

      allCheckedFeatures.push(
        makeFeature(el, "z", this.state.colors["z"], 200)
      );
      allCheckedFeatures.push(
        makeFeature(
          el,
          "PiezometricLWet",
          this.state.colors["PiezometricLWet"],
          200
        )
      );

      allCheckedFeatures.push(
        makeFeature(el, "zWet", this.state.colors["zWet"], 200)
      );
    }

    console.log("==> allCheckedFeatures len " + allCheckedFeatures.length);

    const geojsonObj = {
      type: "FeatureCollection",
      features: allCheckedFeatures,
    };

    // for pumping rate and drawdown
    console.log(geojsonObj);
    return geojsonObj;
  };

  drawerContent = () => {
    return null;
  };
  drawerContentDown = () => {
    return null;
  };
  getStyleForFeature = (f) => {
    return f.get("style");
  };
  onMapClick = (features) => {
    if (!features || !features.length || features.length < 1) return;
    features.forEach((el) => {});
  };
  popupInfo = (features) =>
    features.map((el) => ` ${el.get("id")} : ${el.get("prop")}`);

  getHeatLayerFeatures = () => null;
}

class SecondMap extends React.Component {
  constructor(props) {
    super(props);
    this.infoRef = React.createRef();
    this.state = {
      anchorEl: null,
      locationServices: {
        Turkey: new TurkeyService(this.reloadCurrentLocation, 12),
        Germany: new GermanyService(this.reloadCurrentLocation),
        Kazakhstan: new Kazakhstan(this.reloadCurrentLocation),
        Algeria: new AlgeriaService(this.reloadCurrentLocation, 12),
        World: new WholeWorldService(this.reloadCurrentLocation, 0),
        Salento: new SalentoService(this.reloadCurrentLocation, 12),
      },
      isDrawerOpen: false,

      colors: {
        red: "rgba(255,0,0,1)",
        green: "rgba(0,255,0,1)",
        blue: "rgba(0,0,255,1)",
        purple: "rgba(145, 61, 136, 1)",
      },
      info: "hello",
      map: this.map,
      selectedState: null,
      infoText: "",
      drawerContent: null,
      drawerContentDown: null,
      isShowing: false,
      toggleDrawer: null,
      open: false,
      blur: parseInt(10),
    };
  }

  reloadCurrentLocation = () => {
    this.goLocation(this.state.location);
  };
  toggleLocation = (location) => {
    this.setState((state) => {
      const currentLocation = state.selectedLocation;
      console.log(currentLocation);
      if (location === currentLocation) {
        return { selectedLocation: "none" }; // toggling
      } else {
        return { selectedLocation: location };
      }
    });
  };
  goLocation = (location) => {
    let service = this.state.locationServices[location];

    const coodinate = service.location;
    let view = this.state.map.getView();
    view.animate({
      center: fromLonLat(coodinate),
      autoPanAnimation: {
        duration: 250,
      },
      zoom: service.zoom || 0.0,
      duration: 300,
    });

    const distData = service.getData();

    if (distData && distData.features) {
      const vectorLayer = this.state.layer;
      var vectorSource = new VectorSource({
        features: new GeoJSON({
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }).readFeatures(distData),
      });
      console.log(vectorSource);
      vectorLayer.setStyle(service.getStyleForFeature);
      vectorLayer.setSource(vectorSource);
    }

    const hotFeatures = service.getHeatLayerFeatures();

    if (hotFeatures !== null) {
      const heatlayer = this.state.heatLayer;
      hotFeatures.forEach((feature) => {
        heatlayer.getSource().addFeature(feature);
      });
    }

    this.setState({
      location: location,
      selectedLocation: location,
      drawerContent: service.drawerContent(this.state.heatLayer),
      drawerContentDown: service.drawerContentDown(),
      toggleDrawer: service.toggleDrawer,
    });
  };

  componentDidMount() {
    var overlay = new Overlay({
      element: this.infoRef.current,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    var vectorSource = new VectorSource({
      features: [],
    });

    var vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const heatlayer = new Heatmap({
      source: new VectorSource(),
    });

    var map = new Map({
      overlays: [overlay],
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
        heatlayer,
      ],
      target: "map",
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    map.on("click", (evt) => {
      overlay.setPosition(undefined);
      let location = this.state.location;
      let service = this.state.locationServices[location];
      if (!service) return;

      let pixel = evt.pixel;
      overlay.setPosition(evt.coordinate);
      let pairs = [];
      var features = map.getFeaturesAtPixel(pixel);
      service.onMapClick(features);
      this.goLocation(location);
      let info = this.state.info;

      this.setState({
        info: service.popupInfo(features),
      });
    });
    this.setState(
      { map: map, layer: vectorLayer, heatLayer: heatlayer },
      () => {
        this.goLocation("World");
      }
    );
  }
  toggleDrawer = () => {
    console.log("hello toggle");
    this.setState({ open: !this.state.open });
  };

  render() {
    let { info, drawerContent, drawerContentDown, toggleDrawer } = this.state;
    return (
      <>
        <Navbar
          toggleDrawer={this.toggleDrawer}
          drawerContentDown={this.drawerContentDown}
          toggleLocation={this.toggleLocation}
          selectedLocation={this.state.selectedLocation}
          goLocation={this.goLocation}
        />
        <div className="conatiner">
          <div id="info" ref={this.infoRef}>
            {info}
          </div>

          <div id="map"></div>

          {drawerContent ? drawerContent : null}
          {drawerContentDown ? drawerContentDown : null}
        </div>
      </>
    );
  }
}

export default SecondMap;
