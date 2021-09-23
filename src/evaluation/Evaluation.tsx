import {
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { notificationFunction } from "../common/notifications/notifications";
import { db } from "../firebase/firebase";
import { EvaluationState, Mode } from "../interface/enums";
import { Employee, Objective } from "../interface/generic";

interface Props {
  objectives: Objective[];
  mode: Mode;
  evaluationOwner: string;
  role: string;
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
      marginBottom: 16,
    },
    input: {
      width: "100%",
      minWidth: 250,
    },
  })
);

export default function Evaluation({
  objectives,
  mode,
  evaluationOwner,
  role,
}: Props): ReactElement {
  const classes = useStyles();
  const history = useHistory();
  const [disableInputs, setDisableInputs] = useState(-1);
  const [disableButtons, setDisableButtons] = useState(-1);
  const [comentario_colaborador, setComentario_colaborador] = useState("");
  const [comentario_supervisor, setComentario_supervisor] = useState("");
  const [razon_denegar, SetRazon_denegar] = useState("");
  const [logro, setLogro] = useState(0);
  const [logro_supervisor, setLogro_supervisor] = useState(0);

  const disableInput = (index: number) => {
    setDisableInputs(index);
  };

  const disableButton = (index: number) => {
    setDisableButtons(index);
  };

  const aprobarDenegarSolicitud = (
    id: string,
    owner: string,
    state: "aprobado" | "denegado",
    razon_denegar: string
  ) => {
    const objetivos = [...objectives];

    let indexFound = 0;
    objetivos.forEach((item, index) => {
      if (item.id === id) {
        indexFound = index;
      }
    });

    let objetivo = objetivos[indexFound];

    if (state === "aprobado") {
      objetivo = { ...objetivo, estado_aprobacion: state, razon_denegar: "" };
    } else {
      if (razon_denegar === "") {
        notificationFunction(
          "Objetivo no se ha podido denegar",
          "Favor ingresar razon para denegar objetivo",
          "danger"
        );
        return;
      }
      objetivo = { ...objetivo, estado_aprobacion: state, razon_denegar };
    }

    objetivos[indexFound] = objetivo;

    db.collection("perfil")
      .doc(owner)
      .collection("evaluaciones")
      .doc("2021")
      .set(
        {
          objetivos,
        },
        { merge: true }
      );

    SetRazon_denegar("");
  };

  const submit = (
    id: string,
    comentario_colaborador: string,
    logro: number
  ) => {
    setDisableButtons(-1);
    setDisableInputs(-1);

    const objetivos = [...objectives];

    objetivos.forEach((item: Objective, i) => {
      if (item.id === id) {
        if (role === "empleado") {
          objetivos[i] = { ...item, comentario_colaborador, logro };
        } else {
          objetivos[i] = { ...item, comentario_supervisor, logro_supervisor };
        }
      }
    });

    db.collection("perfil")
      .doc(evaluationOwner)
      .collection("evaluaciones")
      .doc("2021")
      .set(
        {
          objetivos,
        },
        { merge: true }
      );

    setComentario_colaborador("");
    setLogro(0);
  };

  const sendEvaluation = (role: string, colaboradorId: string) => {
    if (role === "empleado") {
      db.collection("perfil")
        .doc(evaluationOwner)
        .collection("evaluaciones")
        .doc("2021")
        .set(
          {
            estado: EvaluationState.Completa,
          },
          { merge: true }
        );

      const supervisorId = sessionStorage.getItem("supervisorId");

      if (supervisorId !== null) {
        db.collection("perfil")
          .doc(supervisorId)
          .get()
          .then((item) => {
            if (item.exists) {
              let colaboradores: Employee[] = item.data()?.colaboradores;

              if (colaboradores !== undefined) {
                colaboradores.forEach((item, index) => {
                  if (item.id === colaboradorId) {
                    const foundIndex = index;
                    colaboradores[foundIndex] = {
                      ...item,
                      estado: EvaluationState.Completa,
                    };
                  }
                });
              }

              db.collection("perfil").doc(supervisorId).set(
                {
                  colaboradores,
                },
                { merge: true }
              );
            }
          });
      }

      history.push("/resultados");
    }
    if (role === "supervisor") {
      db.collection("perfil")
        .doc(evaluationOwner)
        .collection("evaluaciones")
        .doc("2021")
        .set(
          {
            estado: EvaluationState.Retroalimentacion,
          },
          { merge: true }
        );
    }
  };

  const evaluationForm = () => {
    if (mode === Mode.Aprobar) {
      return (
        <>
          {objectives.map((item, index) => (
            <Grid key={index}>
              <Paper style={{ padding: 20, margin: 20 }}>
                <Grid container direction="column">
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    Categoría.
                  </Typography>
                  <Typography
                    style={{ textTransform: "capitalize", marginBottom: 10 }}
                  >
                    {item.categoria.replaceAll("_", " ")}
                  </Typography>

                  <Typography
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    Descripción del objetivo.
                  </Typography>
                  <Typography
                    style={{ textTransform: "capitalize", marginBottom: 10 }}
                  >
                    {item.descripcion}
                  </Typography>

                  <Typography style={{ marginBottom: 10 }}>
                    Meta: {item.meta}
                  </Typography>

                  <Typography style={{ marginBottom: 10 }}>
                    Peso: {item.peso}
                  </Typography>

                  <Grid
                    container
                    justify="center"
                    className={classes.formControl}
                  >
                    <FormControl>
                      <TextField
                        className={classes.input}
                        label="Razón para denegar"
                        variant="outlined"
                        name="denegar"
                        defaultValue={
                          item.razon_denegar === "" ? null : item.razon_denegar
                        }
                        onChange={(e) => SetRazon_denegar(e.target.value)}
                        multiline
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid style={{ marginTop: 20 }}>
                  <Button
                    style={{ marginRight: 20 }}
                    variant="contained"
                    color="primary"
                    disabled={item.estado_aprobacion === "aprobado"}
                    onClick={() =>
                      aprobarDenegarSolicitud(
                        item.id,
                        evaluationOwner,
                        "aprobado",
                        ""
                      )
                    }
                  >
                    Aprobar
                  </Button>
                  <Button
                    style={{ marginLeft: 20 }}
                    variant="contained"
                    color="secondary"
                    disabled={item.estado_aprobacion === "denegado"}
                    onClick={() =>
                      aprobarDenegarSolicitud(
                        item.id,
                        evaluationOwner,
                        "denegado",
                        razon_denegar
                      )
                    }
                  >
                    Denegar
                  </Button>
                </Grid>
              </Paper>
            </Grid>
          ))}

          <Grid container justify="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push("/gestion-personas")}
            >
              Completar
            </Button>
          </Grid>
        </>
      );
    } else {
      return (
        <>
          {objectives.map((item, index) => (
            <Grid item key={item.id}>
              <Paper style={{ padding: 20, margin: 20 }}>
                <Grid container direction="column">
                  <Grid container direction="column">
                    <Typography
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      Categoría.
                    </Typography>
                    <Typography
                      style={{ textTransform: "capitalize", marginBottom: 10 }}
                    >
                      {item.categoria.replaceAll("_", " ")}
                    </Typography>
                  </Grid>

                  <Grid container direction="column">
                    <Typography
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      Descripción del objetivo.
                    </Typography>
                    <Typography
                      style={{ textTransform: "capitalize", marginBottom: 10 }}
                    >
                      {item.descripcion}
                    </Typography>
                  </Grid>

                  <Typography style={{ marginBottom: 10 }}>
                    Meta: {item.meta}
                  </Typography>

                  <Typography style={{ marginBottom: 10 }}>
                    Peso: {item.meta}
                  </Typography>

                  <Grid
                    container
                    justify="center"
                    className={classes.formControl}
                  >
                    <FormControl>
                      <TextField
                        className={classes.input}
                        label="Logro"
                        variant="outlined"
                        type="number"
                        defaultValue={item.logro === 0 ? null : item.logro}
                        name="logro"
                        onChange={(e) => setLogro(parseInt(e.target.value))}
                        disabled={
                          index === disableInputs && role === "empleado"
                            ? false
                            : true
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid
                    container
                    justify="center"
                    className={classes.formControl}
                  >
                    <FormControl>
                      <TextField
                        className={classes.input}
                        label="Comentarios"
                        variant="outlined"
                        name="comentarios"
                        defaultValue={
                          item.comentario_colaborador === ""
                            ? null
                            : item.comentario_colaborador
                        }
                        onChange={(e) =>
                          setComentario_colaborador(e.target.value)
                        }
                        multiline
                        disabled={
                          index === disableInputs && role === "empleado"
                            ? false
                            : true
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid
                    container
                    justify="center"
                    className={classes.formControl}
                  >
                    <FormControl>
                      <TextField
                        className={classes.input}
                        label="Evaluación de logro"
                        variant="outlined"
                        type="number"
                        defaultValue={
                          item.logro_supervisor === 0
                            ? null
                            : item.logro_supervisor
                        }
                        name="logro"
                        onChange={(e) =>
                          setLogro_supervisor(parseInt(e.target.value))
                        }
                        disabled={
                          index === disableInputs && role === "supervisor"
                            ? false
                            : true
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid
                    container
                    justify="center"
                    className={classes.formControl}
                  >
                    <FormControl>
                      <TextField
                        className={classes.input}
                        label="Retroalimentación"
                        variant="outlined"
                        name="comentarios"
                        defaultValue={
                          item.comentario_colaborador === ""
                            ? null
                            : item.comentario_supervisor
                        }
                        onChange={(e) =>
                          setComentario_supervisor(e.target.value)
                        }
                        multiline
                        disabled={
                          index === disableInputs && role === "supervisor"
                            ? false
                            : true
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid container justify="center">
                    {disableButtons === -1 || disableInputs !== index ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          disableInput(index);
                          disableButton(index);
                        }}
                      >
                        Editar
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          submit(item.id, comentario_colaborador, logro)
                        }
                      >
                        Guardar
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}

          <Grid container justify="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => sendEvaluation(role, evaluationOwner)}
            >
              Guardar y Enviar evaluacion
            </Button>
          </Grid>
        </>
      );
    }
  };
  return (
    <>
      <Grid container justify="center">
        {evaluationForm()}
      </Grid>
    </>
  );
}
