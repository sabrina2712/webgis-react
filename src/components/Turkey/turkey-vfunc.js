class TurkeyService {
  constructor(reloadDataCallback, zoom) {
    this.reloadData = reloadDataCallback;
    this.zoom = zoom;
    this.location = [34.82091, 36.815247];
    this.state = {
      colorPickerVisibility: {
        DTW: false,
        WD: false,
        WH: false,
        SPC: false,
        PP: false,
        DD: false,
      },
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
      },
      colors: {
        DTW: "rgba(255,0, 0, 0.7)",
        WD: "rgba(0, 128, 0, 0.9)",
        WH: "rgb(56, 31, 65, 0.7)",
        SPC: "rgba(201, 224, 50, 0.8)",
        PP: "rgb(19, 17, 250,0.8)",
        DD: "rgb(179, 167, 228,.7)",
      },

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
            this.changeFeatureColor(v, color.hex);
            this.reloadData();
          }}
        />
      </div>
    );
  };

  toogleFeature = (f) => {
    this.setState((state) => {
      const features = state.features;
      features[f] = !features[f];
      return { features: features };
    });
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
    let allCheckedFeatures = [];
    const len = data.length;

    for (var i = 0; i < len; i++) {
      let el = data[i];

      if (this.state.dtwIsChecked) {
        console.log("adding dtw");
        allCheckedFeatures.push(
          makeFeature(el, "DTW", this.state.colors["DTW"], 1)
        );
      }
      if (this.state.wdIsChecked) {
        allCheckedFeatures.push(
          makeFeature(el, "Well_depth", this.state.colors["WD"], 0.3)
        );
      }

      if (this.state.whIsChecked) {
        allCheckedFeatures.push(
          makeFeature(el, "Wellhead", this.state.colors["WH"], 10)
        );
      }
      if (this.state.spcIsChecked) {
        allCheckedFeatures.push(
          makeFeature(el, "Specific_capacity", this.state.colors["SPC"], 1)
        );
      }
    }
    for (let index = 0; index < dataTar.length; index++) {
      const el = dataTar[index];

      if (this.state.pumpIsChecked) {
        allCheckedFeatures.push(
          makeFeature(el, "Pumping_m3", this.state.colors["PP"], 300)
        );
      }
      if (this.state.ddIsChecked) {
        allCheckedFeatures.push(
          makeFeature(el, "Drawdown_m", this.state.colors["DD"], 0.7)
        );
      }
    }

    console.log("==> allCheckedFeatures len " + allCheckedFeatures.length);

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
          checked={this.state.features.t}
          color="primary"
          onChange={() => {
            if (t === "DTW") {
              this.state.dtwIsChecked = !this.state.dtwIsChecked;
            }
            if (t === "WD") {
              this.state.wdIsChecked = !this.state.wdIsChecked;
            }
            if (t === "WH") {
              this.state.whIsChecked = !this.state.whIsChecked;
            }
            if (t === "PP") {
              this.state.pumpIsChecked = !this.state.pumpIsChecked;
            }
            if (t === "DD") {
              this.state.ddIsChecked = !this.state.ddIsChecked;
            }
            if (t === "SPC") {
              this.state.spcIsChecked = !this.state.spcIsChecked;
            }
            this.reloadData();
          }}
        />
      </ListItemIcon>
    );
  };

  pickerVisvibilityMethod = (t) => {
    if (t === "DTW") {
      this.state.isDtwOpen = !this.state.isDtwOpen;
    }
    if (t === "WD") {
      this.state.isWdOpen = !this.state.isWdOpen;
    }
    if (t === "WH") {
      this.state.isWhOpen = !this.state.isWhOpen;
    }
    if (t === "PP") {
      this.state.isPumpOpen = !this.state.isPumpOpen;
    }
    if (t === "DD") {
      this.state.isDdOpen = !this.state.isDdOpen;
    }
    if (t === "SPC") {
      this.state.isSpcOpen = !this.state.isSpcOpen;
    }
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
            <ListItem button key="k1">
              {this.getListItemIcon("DTW")}

              <ListItemText primary="DTW" />

              <div className="picker-turkey">
                <div
                  onClick={() => this.pickerVisvibilityMethod("DTW")}
                  style={{
                    backgroundColor: this.state.colors["DTW"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.isDtwOpen === true ? (
              <ListItem>{this.getPickerComponent("DTW")}</ListItem>
            ) : null}
            <ListItem button key="k2">
              {this.getListItemIcon("WD")}
              <ListItemText primary="Well Depth" />

              <div className="picker-turkey">
                <div
                  onClick={() => this.pickerVisvibilityMethod("WD")}
                  style={{
                    backgroundColor: this.state.colors["WD"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.isWdOpen === true ? (
              <ListItem>{this.getPickerComponent("WD")}</ListItem>
            ) : null}
            <ListItem button key="k3">
              {this.getListItemIcon("WH")}
              <ListItemText primary="Well Head" />

              <div className="picker-turkey">
                <div
                  onClick={() => this.pickerVisvibilityMethod("WH")}
                  style={{
                    backgroundColor: this.state.colors["WH"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.isWhOpen === true ? (
              <ListItem>{this.getPickerComponent("WH")}</ListItem>
            ) : null}
            <ListItem button key="k4">
              {this.getListItemIcon("SPC")}
              <ListItemText primary="Specific Capacity" />
              <div className="picker-turkey">
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
            {this.state.isSpcOpen === true ? (
              <ListItem>{this.getPickerComponent("SPC")}</ListItem>
            ) : null}
            <ListItem button key="k5">
              {this.getListItemIcon("DD")}
              <ListItemText primary="DD" />

              <div className="picker-turkey">
                <div
                  onClick={() => this.pickerVisvibilityMethod("DD")}
                  style={{
                    backgroundColor: this.state.colors["DD"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.isDdOpen === true ? (
              <ListItem>{this.getPickerComponent("DD")}</ListItem>
            ) : null}
            <ListItem button key="k6">
              {this.getListItemIcon("PP")}
              <ListItemText primary="pump" />

              <div className="picker-turkey">
                <div
                  onClick={() => this.pickerVisvibilityMethod("PP")}
                  style={{
                    backgroundColor: this.state.colors["PP"],
                    height: "20px",
                    width: "20px",
                  }}
                ></div>
              </div>
            </ListItem>
            {this.state.isPumpOpen === true ? (
              <ListItem>{this.getPickerComponent("PP")}</ListItem>
            ) : null}
            ;
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
