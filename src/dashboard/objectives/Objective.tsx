import {
  Button,
  createStyles,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { notificationFunction } from "../../common/notifications/notifications";
import { db } from "../../firebase/firebase";

interface Props {
  openModal: boolean;
  closeModal: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      position: "absolute",
      width: 400,
      height: "auto",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #000",
      boxShadow: theme.shadows[5],
      padding: 15,
      [theme.breakpoints.down("xs")]: {
        width: 280,
        height: "auto",
        padding: 15,
      },
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

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function Objective({
  openModal,
  closeModal,
}: Props): ReactElement {
  const classes = useStyles();
  //Style for the modal
  const [modalStyle] = useState(getModalStyle);

  //Register Form
  const { register, handleSubmit, errors, control, setValue } = useForm();

  const onSubmit = (data: any) => {
    const user = sessionStorage.getItem("user");
    const { categoria, meta, descripcion, peso, logro } = data;
    if (user !== null) {
      db.collection("perfil").doc(user).collection("objetivos").add({
        categoria,
        meta,
        descripcion,
        peso,
        logro,
      });

      closeModal();
      notificationFunction(
        "Objetivo ingresado",
        "El objetivo ha sido ingresado exitosamente",
        "success",
        2000
      );
    }
  };

  const categoryList = [
    { value: "optimizacion", label: "Alto desempeño" },
    { value: "cantidad", label: "Cantidad" },
    { value: "desarrollo", label: "Desarrollo sostenible" },
    { value: "fecha", label: "Fecha" },
    { value: "gestionNegocio", label: "Gestión de negocio" },
    { value: "porcentaje", label: "Porcentaje" },
    { value: "reduccion", label: "Reducción de gastos" },
  ];

  const modalBody = (
    <Paper>
      <Grid style={modalStyle} className={classes.mainContainer}>
        <Grid container justify="center">
          <Grid
            container
            style={{ marginTop: 16, marginBottom: 16 }}
            justify="center"
          >
            <Typography>Agregar un objetivo para fin de año</Typography>
          </Grid>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Grid container justify="center">
              <FormControl
                variant="outlined"
                className={classes.formControl}
                error={errors.model && true}
              >
                <InputLabel htmlFor="categoria">Categoría*</InputLabel>
                <Controller
                  as={
                    <Select label="Categoria*" defaultValue="optimizacion">
                      {categoryList.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  defaultValue="optimizacion"
                  name="categoria"
                  control={control}
                  // rules={{ required: true }}
                />
                {errors.model && (
                  <FormHelperText>El campo es requerido</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid container justify="center">
              <FormControl className={classes.formControl}>
                <TextField
                  label="Meta*"
                  variant="outlined"
                  inputRef={register}
                  name="meta"
                  defaultValue=""
                />
              </FormControl>
            </Grid>

            <Grid container justify="center">
              <FormControl className={classes.formControl}>
                <TextField
                  label="Descripción de objetivo*"
                  variant="outlined"
                  inputRef={register}
                  name="descripcion"
                  defaultValue=""
                />
              </FormControl>
            </Grid>

            <Grid container justify="center">
              <FormControl className={classes.formControl}>
                <TextField
                  label="Peso %*"
                  variant="outlined"
                  inputRef={register}
                  name="peso"
                  defaultValue=""
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid container justify="center">
              <FormControl className={classes.formControl}>
                <TextField
                  label="Logro*"
                  variant="outlined"
                  inputRef={register}
                  name="logro"
                  defaultValue=""
                  type="logro"
                />
              </FormControl>
            </Grid>

            <Grid container justify="center">
              <Button variant="contained" color="primary" type="submit">
                Ingresar Objetivo
              </Button>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <>
      <Modal
        open={openModal}
        onClose={closeModal}
        aria-labelledby="enviar-solicitud-correo"
      >
        {modalBody}
      </Modal>
    </>
  );
}
