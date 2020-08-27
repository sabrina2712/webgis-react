
import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import { render } from '@testing-library/react';
import { fromLonLat, get } from "ol/proj"
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';



export default function FadeMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [locations, setLocations] = React.useState({
        "Turkey": [34.767511, 36.842215],
        "Germany": [13.404954, 52.520008]
    });
    const [selectedArea, setSelectedArea] = React.useState({
        selectedArea: null
    })
    const open = Boolean(anchorEl);

    const map = props.map
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button aria-controls="fade-menu"
                aria-haspopup="true"
                onClick={handleClick}
                style={{ color: "white" }}
            >       Study
                Area
        </Button>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem onClick={() => {
                    props.toggleLocation("Turkey")
                }}>
                    <ListItemIcon>
                        <Checkbox
                            id="cb1"
                            color="primary"
                            name="Turkey"
                            onClick={() => {
                                props.goToLocation("Turkey")
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText primary="Turkey" />
                </MenuItem>
                <MenuItem onClick={() => {
                    props.toggleLocation("Germany")
                }}>
                    <ListItemIcon>
                        <Checkbox
                            id="cb2"
                            color="primary"
                            name="Germany"
                            onClick={() => {
                                props.goToLocation("Germany")
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText primary="Germany" />
                </MenuItem>
            </Menu>
        </div>
    );
}

