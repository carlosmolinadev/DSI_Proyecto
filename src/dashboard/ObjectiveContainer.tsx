import React, { ReactElement, useEffect, useState } from "react";
import {
  Button,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import ObjectiveDetails from "./objectives/ObjectiveDetails";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EditIcon from "@material-ui/icons/Edit";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { useHistory } from "react-router-dom";
import { db } from "../firebase/firebase";
import { Employee, Objective } from "../interface/generic";
import { EvaluationState, Mode } from "../interface/enums";
import Results from "../results/Results";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      marginTop: 100,
    },
    addButton: {
      marginTop: 16,
      marginBottom: 16,
    },
    table: {
      minWidth: 1000,
    },
  })
);

interface Props {}

export default function ObjectiveContainer({}: Props): ReactElement {
  const classes = useStyles();
  const history = useHistory();

  const [openModal, setOpenModal] = useState(false);
  const handleCloseEmailModal = () => {
    setOpenModal(false);
  };
  const handleOpenEmailModal = () => {
    setOpenModal(true);
  };

  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [objectiveEdit, setObjectiveEdit] = useState<Objective | null>(null);
  const [evaluationState, setEvaluationState] = useState<EvaluationState>(
    EvaluationState.IngresarObjetivos
  );
  const [completeEvaluation, setCompleteEvaluation] = useState(false);
  const [evaluacionActual, setEvaluacionActual] = useState<string | null>(
    sessionStorage.getItem("evaluacionActual")
  );

  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    setEdit(false);
  };

  useEffect(() => {
    const validate = sessionStorage.getItem("validate");
    if (validate === "false") {
      history.push("/");
    }
  }, [history]);

  useEffect(() => {
    const user = sessionStorage.getItem("user");

    const getObjectives = async () => {
      if (user !== null && evaluacionActual !== null) {
        db.collection("perfil")
          .doc(user)
          .collection("evaluaciones")
          .doc(evaluacionActual)
          .onSnapshot((snapshot) => {
            if (snapshot.exists) {
              const data = snapshot.data();

              if (data?.objetivos === undefined) {
                setObjectives([]);
              } else {
                setObjectives(data?.objetivos);
              }

              //here
              if (data?.estado === EvaluationState.Retroalimentacion) {
                setEvaluationState(EvaluationState.Retroalimentacion);
                return;
              }

              if (data?.estado === EvaluationState.Evaluada) {
                setEvaluationState(EvaluationState.Evaluada);
                return;
              }

              if (objectives.length > 0) {
                setEvaluationState(EvaluationState.IngresarObjetivos);
              } else {
                setEvaluationState(EvaluationState.SinObjetivos);
              }
            }
          });
      } else {
        setEvaluationState(EvaluationState.NoIngresada);
      }
    };

    const setEvaluationComplete = async () => {
      if (evaluacionActual !== null) {
        db.collection("perfil")
          .doc(user!)
          .collection("evaluacion")
          .doc(evaluacionActual)
          .get()
          .then((data) => {
            if (data.exists) {
              setEvaluationState(data.data()?.isCompleted);
            }
          });
      }
    };

    getObjectives();
    setEvaluationComplete();

    return () => {};
  }, [objectives.length]);

  console.log(objectives);

  useEffect(() => {
    if (objectives !== []) {
      const objectivesTotal = objectives.length;
      let approvedItems = 0;
      objectives.forEach((item) => {
        if (item.estado_aprobacion === "aprobado") {
          approvedItems = approvedItems + 1;
        }
      });

      if (approvedItems === objectivesTotal) {
        setCompleteEvaluation(true);
      } else {
        setCompleteEvaluation(false);
      }
    }
  }, [objectives]);

  const deleteItem = (id: string) => {
    const user = sessionStorage.getItem("user");
    const objetivos = objectives.filter((item) => item.id !== id);

    if (evaluacionActual !== null) {
      db.collection("perfil")
        .doc(user!)
        .collection("evaluaciones")
        .doc(evaluacionActual)
        .set({
          objetivos,
        });
    }
  };

  const saveEvaluation = () => {
    const user = sessionStorage.getItem("user");
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
                if (item.id === user) {
                  const foundIndex = index;
                  colaboradores[foundIndex] = {
                    ...item,
                    estado: EvaluationState.ObjetivosIngresados,
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

    setEvaluationState(EvaluationState.ObjetivosIngresados);
  };

  const realizarAutoevaluacion = () => {
    sessionStorage.setItem("mode", Mode.Evaluar);
    history.push("/evaluacion");
  };

  const editObjective = (objective: Objective) => {
    setObjectiveEdit(objective);
    setEdit(true);
    handleOpenEmailModal();
  };

  // const testDatabase = () => {
  //   const employee = {
  //     empleado_id: "GF18005",
  //     usuario: "efrain@admin",
  //     credenciales: "GF18005",
  //     nombre: "Efrain",
  //     apellido: "Gomez",
  //     cargo: "administrador",
  //     correo: "efrain@gmail.com",
  //     fechaCreacion: new Date().getDate(),
  //   };
  //   db.collection("perfil")
  //     .doc("GF18005")
  //     .set({ ...employee });
  // };

  const ingresarObjetivo = () => {
    setEdit(false);
    handleOpenEmailModal();
  };

  const showTable = () => {
    if (objectives.length > 0) {
      return (
        <Grid container style={{ width: "80%", marginTop: 16 }}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="center">Meta</TableCell>
                  <TableCell align="center">Descripción del objetivo</TableCell>
                  <TableCell align="center">Peso%</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Razon</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {objectives.map((row) => (
                  <TableRow hover={true} key={row.id}>
                    <TableCell
                      scope="row"
                      style={{ textTransform: "capitalize", width: 150 }}
                    >
                      {row.categoria.replaceAll("_", " ")}
                    </TableCell>
                    <TableCell align="center">{row.meta}</TableCell>
                    <TableCell align="center" style={{ width: 200 }}>
                      {row.descripcion}
                    </TableCell>
                    <TableCell align="center">{row.peso}</TableCell>
                    <TableCell
                      align="center"
                      style={{ textTransform: "capitalize" }}
                    >
                      {row.estado_aprobacion.replaceAll("_", " ")}
                    </TableCell>
                    <TableCell align="center">{row.razon_denegar}</TableCell>
                    <TableCell>
                      <Grid container justify="center">
                        <Grid item>
                          <IconButton onClick={() => editObjective(row)}>
                            <EditIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton onClick={() => deleteItem(row.id)}>
                            <DeleteForeverIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      );
    }
  };

  const handleView = () => {
    console.log(evaluationState);
    if (evaluationState === EvaluationState.ObjetivosIngresados) {
      return (
        <Grid>
          <Typography>
            Los objetivos han sido ingresados, esperando aprobación por parte
            del supervisor.
          </Typography>
          <Grid container justify="center" style={{ marginTop: 15 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => history.push("/inicio")}
            >
              Continuar
            </Button>
          </Grid>
        </Grid>
      );
    }

    if (evaluationState === EvaluationState.SinObjetivos) {
      return (
        <Grid>
          <Grid>
            <Typography>
              Todavia no se ha agregado ningun objetivo, seleccionar agregar
              objetivo para comenzar
            </Typography>
          </Grid>

          <Grid container justify="center">
            <Button
              variant="contained"
              color="primary"
              onClick={ingresarObjetivo}
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              Agregar Objetivo
            </Button>
          </Grid>
        </Grid>
      );
    }

    if (evaluationState === EvaluationState.NoIngresada) {
      return (
        <Grid>
          <Grid>
            <Typography>
              No tiene ninguna evaluación pendiente por el momento!
            </Typography>
          </Grid>
        </Grid>
      );
    }

    if (evaluationState === EvaluationState.Retroalimentacion) {
      return <Results estado={EvaluationState.Retroalimentacion} />;
    }

    if (evaluationState === EvaluationState.Evaluada) {
      return <Results estado={EvaluationState.Evaluada} />;
    }

    if (evaluationState === EvaluationState.IngresarObjetivos) {
      return (
        <>
          {showTable()}
          <Grid container justify="center" className={classes.addButton}>
            <Button
              variant="contained"
              color="primary"
              onClick={ingresarObjetivo}
            >
              Agregar Objetivo
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={saveEvaluation}
              style={{ marginLeft: 20, marginRight: 20 }}
            >
              Enviar objetivos
            </Button>

            <Button
              color="primary"
              variant="contained"
              onClick={realizarAutoevaluacion}
              style={{ marginLeft: 10, marginRight: 10 }}
              disabled={!completeEvaluation}
            >
              Realizar Autoevaluación
            </Button>
          </Grid>
        </>
      );
    }
  };

  return (
    <>
      <Grid container justify="center" className={classes.mainContainer}>
        {handleView()}
      </Grid>

      <ObjectiveDetails
        openModal={openModal}
        closeModal={handleCloseEmailModal}
        edit={edit}
        objectives={objectives}
        objectiveData={objectiveEdit}
        onCloseEdit={handleEdit}
        evaluacionActual={evaluacionActual}
      />
    </>
  );
}
