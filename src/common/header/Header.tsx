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
import { db } from "../../firebase/firebase";

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

interface Props {
  module?: string;
}

export default function Header({ module }: Props): ReactElement {
  const classes = useStyles();
  const history = useHistory();

  const logout = () => {
    const usuario = sessionStorage.getItem("user");
    if (usuario !== null) {
      db.collection("perfil").doc(usuario).set(
        {
          logoutTime: new Date().getTime(),
          loginTime: 0,
        },
        { merge: true }
      );
    }

    sessionStorage.setItem("validate", "false");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("validate");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("employeeId");
    sessionStorage.removeItem("fullname");
    sessionStorage.removeItem("mode");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("supervisorId");
    sessionStorage.removeItem("evaluacionActual");

    history.push("/");
  };

  const [fullname, setFullName] = useState<string | null>("");

  useEffect(() => {
    const name = sessionStorage.getItem("username");
    setFullName(name);
  }, [fullname]);

  const showModuleName = () => {
    if (module === "gestion") {
      return (
        <Typography style={{ flex: 1, marginLeft: 10 }}>
          {`GESTION DE PERSONAL`}
        </Typography>
      );
    }
    if (module === "evaluacion") {
      return (
        <Typography style={{ flex: 1, marginLeft: 10 }}>EVALUACION</Typography>
      );
    }
    if (module === "historial") {
      return (
        <Typography style={{ flex: 1, marginLeft: 10 }}>HISTORIAL</Typography>
      );
    }
    if (module === "resultados") {
      return (
        <Typography style={{ flex: 1, marginLeft: 10 }}>RESULTADOS</Typography>
      );
    }
    if (module === "objetivos") {
      return (
        <Typography style={{ flex: 1, marginLeft: 10 }}>
          GESTION DE OBJETIVOS
        </Typography>
      );
    } else {
      return (
        <Typography style={{ flex: 1, marginLeft: 10 }}>
          {`Bienvenid@ ${fullname}`}
        </Typography>
      );
    }
  };
  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          {showModuleName()}

          <IconButton onClick={() => history.push("/inicio")}>
            <LibraryBooksIcon style={{ color: "white", marginRight: 8 }} />
          </IconButton>

          <IconButton onClick={() => history.push("/inicio")}>
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
