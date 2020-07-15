
import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import { render } from '@testing-library/react';
import { fromLonLat, get } from "ol/proj"


export default function FadeMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [locations,setLocations] = React.useState({"TAR" : ([34.767511,36.842215 ]),
    "Rome" : ([ 12.496366, 41.902782])})
    
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };


  const goToLocation =(evt)=>{
    let selectedArea = evt.target.name;
        let coor =this.state.locations[evt.target.name];
        console.log(selectedArea)
        let view =this.state.map.getView()
        this.toggleLocation()
        
    if (evt.target.checked === true){
        let view =  this.state.map.getView()
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
            <MenuItem onClick={handleClose}
               
                name ="TAR"
                onChange={goToLocation}>TAR
                
            </MenuItem>
            <MenuItem onClick={handleClose}
              
                name ="Rome"
                onChange={goToLocation}>Rome
            </MenuItem>
                
        </Menu>
        </div>
  );
}

