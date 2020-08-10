
import React from "react";
import 'ol/ol.css';

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
import { SketchPicker } from 'react-color'
import { fromLonLat, get } from "ol/proj"
import FadeMenu from "../areaMenu"

class Navbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            features: {
                DTW: false, WD: false, WH: false, HC: false, PP: false, DD: false
            },
            colorPickerVisibility: {
                DTW: false, WD: false, WH: false, HC: false, PP: false, DD: false
            },
            locations: {
                "Turkey": ([34.767511, 36.842215]),
                "Germany": ([13.404954, 52.520008]),
            },
            map: this.map,
            view: this.view
        }
    }


    getListItemIcon = (t) => {
        return <ListItemIcon>
            <Checkbox checked={this.state.features.t}
                color="primary"
                onChange={() => {
                    this.toogleFeature(t);
                }}
            />
        </ListItemIcon>
    }
    getPickerVisvibility = (v) => {
        return <ListItem>
            <div style={{}}>
                <SketchPicker color={this.state.colors.v} onChange={(color) => { this.changeFeatureColor(v, color.hex) }} />
            </div>
        </ListItem>
    }
    getPicker = (p) => {
        return <ListItemSecondaryAction>
            <div onClick={() => {
                console.log(p)
                this.toggleColorPicker(p);
            }}>
                <div style={this.getStyle(p)} />
            </div>
        </ListItemSecondaryAction>
    }
    toogleFeature = (f) => {
        this.setState((state) => {
            const features = state.features;
            features[f] = !features[f];
            return { features: features };
        })
    }
    goToLocation = (location) => {
        const map = this.props.map
        let selectedArea = location;
        let coor = this.state.locations[location];
        let view = this.state.map.getView();

        if (coor) {
            const map = this.props.map
            let view = this.state.map.getView()
            view.animate({
                center: fromLonLat(coor),
                zoom: 11,
                duration: 300
            });
        }
        if (selectedArea === location) {
            view.animate({
                center: fromLonLat([0, 0]),
                zoom: 2,
                duration: 300
            });
        }
    }
    render() {
        const features = this.state.features;


        const drawerStudyArea =
            <>


                <AppBar position="static" style={{ background: '#2E3B55' }}>
                    <Toolbar>
                        <Hidden smUp>
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.props.toggleDrawer}>
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                        <Typography variant="h6">
                            WebGIS Demo
                        </Typography>

                        <FadeMenu map={this.state.map} toggleLocation={this.props.toggleLocation} selectedLocation={this.props.selectedLocation} goToLocation={this.props.goToLocation} />

                    </Toolbar>

                </AppBar>

            </>


        return <>

            {drawerStudyArea}

        </>

    }



}
export default Navbar;