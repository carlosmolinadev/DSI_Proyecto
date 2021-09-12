import React, { ReactElement } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import { Button, FormControl, Grid, Paper, TextField } from "@material-ui/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { db } from "../firebase/firebase";
import { notificationFunction } from "../common/notifications/notifications";
import { useHistory } from "react-router-dom";

interface Props {}

interface Credenciales {
  usuario: string;
  password: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      marginTop: "10%",
    },
    paper: {
      padding: 20,
    },
    formControl: {
      width: "90%",

      marginBottom: 16,
    },
  })
);

export default function Login({}: Props): ReactElement {
  const classes = useStyles();

  //Register Form
  const { register, handleSubmit, errors, control, setValue } =
    useForm<Credenciales>();

  const history = useHistory();

  const onSubmit: SubmitHandler<Credenciales> = (data) => {
    // db.collection("perfil").doc("MM18054").set({
    //   nombre: "Carlos",
    //   apellido: "Molina",
    //   cargo: "administrador",
    //   correo: "carlos@gmail.com",
    //   password: "12345",
    //   empleadoId: "MM18054",
    //   fechaCreacion: new Date().getTime(),
    //   usuario: "carlos",
    // });

    const { usuario, password } = data;

    ingresar(usuario.toUpperCase(), password);
  };

  const ingresar = async (usuario: string, password: string) => {
    const data = await db.collection("perfil").doc(usuario).get();

    if (data.exists) {
      const credenciales = data.data();
      const role = credenciales?.rol;
      const supervisorId = credenciales?.supervisorId;
      if (
        credenciales?.empleadoId === usuario &&
        credenciales?.password === password
      ) {
        sessionStorage.setItem("validate", "true");
        sessionStorage.setItem("user", `${credenciales?.empleadoId}`);
        sessionStorage.setItem(
          "username",
          `${credenciales?.nombre} ${credenciales?.apellido}`
        );
        sessionStorage.setItem("role", role);
        if (supervisorId !== undefined) {
          sessionStorage.setItem("supervisorId", supervisorId);
        }
        history.push("/inicio");
      } else {
        notificationFunction(
          "Usuario o contraseña incorrecta",
          "Verificar la información agregada o contactar al administrador para más detalles",
          "danger",
          3000
        );
      }
    } else {
      notificationFunction(
        "Usuario o contraseña incorrecta",
        "Verificar la información agregada o contactar al administrador para más detalles",
        "danger",
        3000
      );
    }
  };

  return (
    <Grid container justify="center" className={classes.mainContainer}>
      <Paper className={classes.paper}>
        <Grid container style={{ marginTop: 16, marginBottom: 16 }}>
          <Typography>
            Especifique usuario y contraseña válidos para la aplicación
          </Typography>
        </Grid>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <Grid container justify="center">
            <FormControl className={classes.formControl}>
              <TextField
                label="Usuario*"
                variant="outlined"
                inputRef={register}
                name="usuario"
                defaultValue=""
              />
            </FormControl>
          </Grid>

          <Grid container justify="center">
            <FormControl className={classes.formControl}>
              <TextField
                label="Contraseña*"
                variant="outlined"
                inputRef={register}
                name="password"
                defaultValue=""
                type="password"
              />
            </FormControl>
          </Grid>

          <Grid container justify="center">
            <Button variant="contained" color="primary" type="submit">
              Ingresar
            </Button>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
}
