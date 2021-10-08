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

  const [razon_denegar, SetRazon_denegar] = useState("");
  const [tempObjectives, setTempObjectives] = useState<Objective[]>([
    ...objectives,
  ]);

  const setInput = (
    id: string,
    rol: string,
    type: "comentario" | "logro",
    input: string
  ) => {
    let objetivos = [...objectives];
    let indexFound = 0;
    objetivos.forEach((item, index) => {
      if (item.id === id) {
        indexFound = index;
      }
    });

    const objetivo = objetivos[indexFound];

    if (rol === "empleado") {
      if (type === "comentario") {
        objetivos[indexFound] = {
          ...objetivo,
          comentario_colaborador: input === undefined ? "" : input,
        };
      } else {
        objetivos[indexFound] = {
          ...objetivo,
          logro: input === undefined ? 0 : parseInt(input),
        };
      }
    }

    if (rol === "supervisor") {
      if (type === "comentario") {
        objetivos[indexFound] = {
          ...objetivo,
          comentario_supervisor: input === undefined ? "" : input,
        };
      } else {
        objetivos[indexFound] = {
          ...objetivo,
          logro_supervisor: input === undefined ? 0 : parseInt(input),
        };
      }
    }

    setTempObjectives(objetivos);
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

  const sendEvaluation = (role: string, colaboradorId: string) => {
    db.collection("perfil")
      .doc(evaluationOwner)
      .collection("evaluaciones")
      .doc("2021")
      .set(
        {
          objetivos: tempObjectives,
        },
        { merge: true }
      );

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
      history.goBack();
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
          {objectives.map((item) => (
            <Grid item key={item.id}>
              <Paper style={{ padding: 20, margin: 10 }}>
                <Grid container justify="space-between">
                  <Grid>
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

                  <Grid>
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

                  <Grid>
                    <Typography
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      Meta.
                    </Typography>
                    <Typography
                      style={{ textTransform: "capitalize", marginBottom: 10 }}
                    >
                      {item.meta}
                    </Typography>
                  </Grid>

                  <Grid>
                    <Typography
                      style={{
                        textTransform: "capitalize",
                        fontWeight: "bold",
                      }}
                    >
                      Peso.
                    </Typography>
                    <Typography
                      style={{ textTransform: "capitalize", marginBottom: 10 }}
                    >
                      {item.peso}
                    </Typography>
                  </Grid>

                  <Grid
                    container
                    justify="space-between"
                    style={{ marginTop: 10 }}
                  >
                    <Grid item className={classes.formControl}>
                      <FormControl>
                        <TextField
                          className={classes.input}
                          label="Logro"
                          variant="outlined"
                          type="number"
                          defaultValue={item.logro === 0 ? null : item.logro}
                          name="logro"
                          onChange={(e) =>
                            setInput(
                              item.id,
                              "empleado",
                              "logro",
                              e.target.value
                            )
                          }
                          disabled={role === "empleado" ? false : true}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item className={classes.formControl}>
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
                            setInput(
                              item.id,
                              "empleado",
                              "comentario",
                              e.target.value
                            )
                          }
                          multiline
                          disabled={role === "empleado" ? false : true}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item className={classes.formControl}>
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
                            setInput(
                              item.id,
                              "supervisor",
                              "logro",
                              e.target.value
                            )
                          }
                          disabled={role === "supervisor" ? false : true}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item className={classes.formControl}>
                      <FormControl>
                        <TextField
                          className={classes.input}
                          label="Retroalimentación"
                          variant="outlined"
                          name="comentarios"
                          defaultValue={
                            item.comentario_supervisor === ""
                              ? null
                              : item.comentario_supervisor
                          }
                          onChange={(e) =>
                            setInput(
                              item.id,
                              "supervisor",
                              "comentario",
                              e.target.value
                            )
                          }
                          multiline
                          disabled={role === "supervisor" ? false : true}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* <Grid item justify="center">
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
                  </Grid> */}
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
