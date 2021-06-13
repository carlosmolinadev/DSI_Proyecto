import React, { ReactElement, useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { Button, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Chats from "@material-ui/icons/Forum";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link, useHistory } from "react-router-dom";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      marginBottom: 80,
    },
    toolbar: {
      alignItems: "center",
    },
    menuButton: {},
    listMenu: {
      width: 400,
      maxWidth: "60vw",
      backgroundColor: theme.palette.background.paper,
    },
  })
);

interface Props {}

export default function Header({}: Props): ReactElement {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Typography style={{ flex: 1, marginLeft: 10 }}>
            BIENVENIDO USUARIO
          </Typography>

          <IconButton>
            <LibraryBooksIcon style={{ color: "white", marginRight: 8 }} />
          </IconButton>

          <IconButton>
            <AccountCircleIcon
              style={{ color: "white", marginRight: 8 }}
              aria-label="menu"
            />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
