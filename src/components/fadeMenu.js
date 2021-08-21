import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import { render } from "@testing-library/react";
import { fromLonLat, get } from "ol/proj";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

/*
export default function FadeMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [locations, setLocations] = React.useState({
    Turkey: [34.767511, 36.842215],
    Germany: [13.404954, 52.520008],
    Kazakhstan: [47.31979, 60.99798],
    Algeria: [8.124005581, 36.83574561],
  });
  const [selectedArea, setSelectedArea] = React.useState({
    selectedArea: null,
  });
  const open = Boolean(anchorEl);

  const map = props.map;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="fade-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{ color: "white" }}
      >
        {" "}
        Study Area
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            props.toggleLocation("Turkey");
          }}
        >
          <ListItemIcon>
            <Checkbox
              id="cb1"
              color="primary"
              name="Turkey"
              onClick={() => {
                props.goLocation("Turkey");
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Turkey" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.toggleLocation("Germany");
          }}
        >
          <ListItemIcon>
            <Checkbox
              id="cb2"
              color="primary"
              name="Germany"
              onClick={() => {
                props.goLocation("Germany");
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Germany" />
        </MenuItem>

        <MenuItem
          onClick={() => {
            props.toggleLocation("Kazakhstan");
          }}
        >
          <ListItemIcon>
            <Checkbox
              id="cb1"
              color="primary"
              name="Turkey"
              onClick={() => {
                props.goLocation("Kazakhstan");
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Kazakhstan" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.toggleLocation("Algeria");
          }}
        >
          <ListItemIcon>
            <Checkbox
              id="cb1"
              color="primary"
              name="Algeria"
              onClick={() => {
                props.goLocation("Algeria");
              }}
            />
          </ListItemIcon>
          <ListItemText primary="Algeria" />
        </MenuItem>
      </Menu>
    </div>
  );
}

*/

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    background: "#34495e",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function FadeMenu(props) {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isHamburgerClicked = false;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [locations, setLocations] = React.useState({
    Turkey: [34.767511, 36.842215],
    Germany: [13.404954, 52.520008],
    Kazakhstan: [47.31979, 60.99798],
    Algeria: [8.124005581, 36.83574561],
    Salento: [18.26784622, 40.37777579],
  });
  const [selectedArea, setSelectedArea] = React.useState({
    selectedArea: null,
  });
  const open = Boolean(anchorEl);

  const map = props.map;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    return true;
  };

  const handleDrawerClose = () => {
    return false;
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
            vv
          >
            <MenuIcon
              onClick={() => {
                props.toggleDrawer();
              }}
            />
          </IconButton>
          <Typography variant="h6" noWrap onClose={handleClose}>
            Current Location :: {props.selectedLocation}
          </Typography>
        </Toolbar>
      </AppBar>
      {isSmallScreen === false && (
        <Drawer
          variant="permanent"
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>Close</IconButton>
          </div>
          <Divider />
          <List>
            {["Turkey", "Germany", "Algeria", "Kazakhstan", "Salento"].map(
              (text, index) => (
                <ListItem
                  onClick={() => {
                    props.goLocation(text);
                  }}
                  button
                  key={text}
                >
                  <ListItemIcon>
                    {props.selectedLocation === text ? (
                      <CheckBoxIcon />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    onClick={() => {
                      props.goLocation(text);
                    }}
                  />
                </ListItem>
              )
            )}
          </List>
        </Drawer>
      )}
    </div>
  );
}
