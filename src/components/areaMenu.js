
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

   

    
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
   const map = props.map
    

  const goToLocation =(evt)=>{
 
    let selectedArea = evt.target.name;
  
        let coor =locations[evt.target.name];
        console.log(selectedArea)
        let view = map.getView()
        console.log( map)
        
    if (evt.target === true){
        const map = props.map
        let view =  map.getView()
            view.animate({
                center:fromLonLat(coor),
                zoom: 11,
                duration: 2000
            });      
    
    }else {
            view.animate({
                center:fromLonLat([0,0]),
                zoom: 2,
                duration: 2000
            }); 

    }}



 
    return (
        <div>
        <Button aria-controls="fade-menu" 
                aria-haspopup="true" 
                onClick={handleClick}
        >       Study Area
        </Button>
        <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
            <MenuItem onClick={handleClose}>
           
                            <ListItemIcon>
                                <Checkbox 
                                id= "cb1"
                                color="primary"
                                name ="TAR"
                                onClick={goToLocation}
                                />
                            </ListItemIcon>
                            <ListItemText primary="TAR" />
                      
                
            </MenuItem>
            <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                                <Checkbox 
                               
                                id= "cb2"
                                    color="primary"
                                    name ="Rome"
                                    onClick={goToLocation}
                                />
                            </ListItemIcon>
                            <ListItemText primary="Rome" />
                            </MenuItem>
        </Menu>
        </div>
  );
}

