import React, { ReactElement, useEffect, useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { IconButton } from "@material-ui/core";

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
            {`Bienvenid@ ${fullname}`}
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
