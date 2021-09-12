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
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uuid } from "uuidv4";
import { Objective } from "../../interface/generic";

interface Props {
  openModal: boolean;
  closeModal: () => void;
  objectiveData: Objective | null;
  objectives: Objective[];
  edit: boolean;
  onCloseEdit: () => void;
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

export default function ObjectiveDetails({
  openModal,
  closeModal,
  objectiveData,
  objectives,
  edit,
  onCloseEdit,
}: Props): ReactElement {
  const classes = useStyles();
  //Style for the modal
  const [modalStyle] = useState(getModalStyle);

  //Schema registration
  const schema = yup.object().shape({
    categoria: yup.string().required(),
    meta: yup.string().required(),
    descripcion: yup.string().required(),
    peso: yup
      .number()
      .typeError("El campo es requerido")
      .required("El campo es requerido")
      .min(1, "El valor ingresado debe ser mayor a 1")
      .max(100, "El valor ingresado no puede ser mayor a 100"),
    logro: yup
      .number()
      .min(1, "El valor ingresado debe ser mayor a 1")
      .max(100, "El valor ingresado no puede ser mayor a 100"),
  });

  //Register Form
  const { register, handleSubmit, errors, control, setValue } =
    useForm<Objective>({ resolver: yupResolver(schema) });

  // const verifyWeight = (user:string, edit:boolean) => {
  //   const data = db.collection('perfil').doc(user).collection('objetivos').get();
  //   const peso = data.then(doc => {
  //     if (doc.exists) {
  //       return doc.data().
  //     }
  //   })
  // }

  // Cuando se ingresa un nuevo objetivo se envia a la base de datos
  const onSubmit = (data: any) => {
    const user = sessionStorage.getItem("user");
    const { categoria, meta: tempMeta, descripcion, peso: tempPeso } = data;
    const peso = parseInt(tempPeso);
    const meta = parseInt(tempMeta);

    const id = uuid();
    let objetivos = [...objectives];
    let currentWeight = 0;
    const objective = {
      categoria,
      meta,
      descripcion,
      peso,
      id,
      logro: 0,
      logro_supervisor: 0,
      comentario_colaborador: "",
      comentario_supervisor: "",
    };

    objetivos.forEach((item) => (currentWeight += item.peso));

    if (currentWeight + peso > 100) {
      notificationFunction(
        "El objetivo no ha podido ser agregado",
        "El objetivo sobrepasa el 100% del peso",
        "danger",
        2000
      );
    } else {
      if (user !== null) {
        if (edit) {
          if (objectiveData !== null) {
            const currentId = objectiveData.id;
            let indexFound = 0;
            objetivos.forEach((item, index) => {
              if (item.id === currentId) {
                indexFound = index;
              }
            });

            objetivos[indexFound] = objective;
          }

          db.collection("perfil")
            .doc(user)
            .collection("evaluaciones")
            .doc("2021")
            .set(
              {
                objetivos,
                usuario: user,
              },
              { merge: true }
            );
          notificationFunction(
            "Objetivo modificado",
            "El objetivo ha sido modificado exitosamente",
            "success",
            2000
          );
        } else {
          objetivos.push(objective);
          db.collection("perfil")
            .doc(user)
            .collection("evaluaciones")
            .doc("2021")
            .set(
              {
                objetivos,
                usuario: user,
              },
              { merge: true }
            );
          notificationFunction(
            "Objetivo ingresado",
            "El objetivo ha sido ingresado exitosamente",
            "success",
            2000
          );
        }
        onCloseEdit();
        closeModal();
      }
    }
  };

  const categoryList = [
    { value: "alto_rendimiento", label: "Alto rendimiento" },
    { value: "cantidad", label: "Cantidad" },
    { value: "desarrollo_sostenible", label: "Desarrollo sostenible" },
    { value: "fecha", label: "Fecha" },
    { value: "gestion_de_negocio", label: "Gestión de negocio" },
    { value: "porcentaje", label: "Porcentaje" },
    { value: "reduccion_de_gastos", label: "Reducción de gastos" },
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
                error={errors.categoria ? true : false}
              >
                <InputLabel htmlFor="categoria">Categoría*</InputLabel>
                <Controller
                  as={
                    <Select
                      label="Categoria*"
                      defaultValue={
                        edit ? objectiveData?.categoria : "alto_rendimiento"
                      }
                    >
                      {categoryList.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  defaultValue={
                    edit ? objectiveData?.categoria : "alto_rendimiento"
                  }
                  name="categoria"
                  control={control}
                  // rules={{ required: true }}
                />
                {errors.categoria && (
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
                  defaultValue={edit ? objectiveData?.meta : ""}
                  helperText={errors.meta && "El campo es requerido"}
                  error={errors.meta ? true : false}
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
                  defaultValue={edit ? objectiveData?.descripcion : ""}
                  helperText={errors.descripcion && "El campo es requerido"}
                  error={errors.descripcion ? true : false}
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
                  defaultValue={edit ? objectiveData?.peso : ""}
                  type="number"
                  helperText={errors.peso?.message}
                  error={errors.peso ? true : false}
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
