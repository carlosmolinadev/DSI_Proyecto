import React, { ReactElement, useEffect, useState } from "react";
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

import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();

  const logout = () => {
    sessionStorage.setItem("validate", "false");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("validate");
    sessionStorage.removeItem("username");
    history.push("/");
  };

  const [fullname, setFullName] = useState<string | null>("");

  useEffect(() => {
    const name = sessionStorage.getItem("username");
    setFullName(name);
  }, [fullname]);

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Typography style={{ flex: 1, marginLeft: 10 }}>
            {`Bienvenido ${fullname}`}
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

          <IconButton onClick={logout}>
            <ExitToAppIcon
              style={{ color: "white", marginRight: 8 }}
              aria-label="menu"
            />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
