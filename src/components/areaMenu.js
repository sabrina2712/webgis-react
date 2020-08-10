
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
        const [locations,setLocations] = React.useState({"TAR" : [34.767511,36.842215 ],
            "Rome" : [ 12.496366, 41.902782]});
        const [selectedLocation, setSelectedLocation] = React.useState(null)
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
        const goToLocation =(location)=>{
           
           const  selectedArea = location
            console.log(selectedArea)
            let coor =locations[selectedArea];
       
        handleClose()
        if (coor){
            let view =  map.getView()
            view.animate({
            center:fromLonLat(coor),
                zoom: 11,
            duration: 300
            });
        }
        if(selectedArea === location) {
            console.log(selectedArea)
            let view =  map.getView()
            view.animate({
                center:fromLonLat([0,0]),
                    zoom: 2,
                duration: 300
                });
            }
             }
        
        const  toggleLocation = (location) => {
            
           const currentLocation = selectedLocation;
            setSelectedLocation(()=>{
               
            console.log(location)
            console.log(currentLocation)
            if(location === currentLocation) {
                let view =  map.getView()
                view.animate({
                    center:fromLonLat([0,0]),
                        zoom: 2,
                    duration: 300
                    });


               
                    } else {
                return {selectedLocatin: location}
                    }
                    });
            }
       
    return (
        <div>
        <Button aria-controls="fade-menu" 
                aria-haspopup="true" 
                onClick={handleClick}
                style ={{color: "white", padding: "16px", fontWeight: "bold"}}
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
            <MenuItem  onClick={()=>{
                goToLocation("TAR")
                }}>
                <ListItemIcon>
                    <Checkbox 
                        id= "cb1"
                        color="primary"
                        name ="TAR"
                    />
                </ListItemIcon>
            <ListItemText primary="TAR" />
            </MenuItem>
            <MenuItem onClick={()=>{
                goToLocation("Rome")
                }}>
                <ListItemIcon>
                    <Checkbox 
                        id= "cb2"
                        color="primary"
                        name ="Rome"
                    />
                </ListItemIcon>
            <ListItemText primary="Rome" />
            </MenuItem>
        </Menu>
        </div>
        );
    }

