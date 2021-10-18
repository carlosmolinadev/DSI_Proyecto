import React, { ReactElement, useEffect, useState } from "react";
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
import { Employee, Objective } from "../interface/generic";
import { db } from "../firebase/firebase";
import { EvaluationState } from "../interface/enums";
import { useHistory } from "react-router";

interface Props {
  estado: string;
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

export default function Results({ estado }: Props): ReactElement {
  const classes = useStyles();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [year, setYear] = useState();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [acuerdos, setAcuerdos] = useState("");
  const history = useHistory();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const evaluacionActual = sessionStorage.getItem("evaluacionActual");

    const getObjectives = async (user: string, evaluacionActual: string) => {
      db.collection("perfil")
        .doc(user)
        .collection("evaluaciones")
        .doc(evaluacionActual)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            setAcuerdos(snapshot.data()?.acuerdos);
            setObjectives(snapshot.data()!.objetivos);
            setYear(snapshot.data()!.year);
          }
        });
    };

    if (user !== null && evaluacionActual !== null) {
      getObjectives(user, evaluacionActual);
    }
  }, []);

  useEffect(() => {
    const supervisorId = sessionStorage.getItem("supervisorId");

    const getEmployees = async (user: string) => {
      const data = await db.collection("perfil").doc(user);

      data.onSnapshot((onSnapshot) => {
        if (onSnapshot.exists) {
          if (onSnapshot.data() !== undefined) {
            if (onSnapshot.data()!.colaboradores !== undefined) {
              setEmployees(onSnapshot.data()!.colaboradores);
            }
          }
        }
      });
    };

    if (supervisorId !== null) {
      getEmployees(supervisorId);
    }
  }, []);

  const calculateTotalPerEmployee = () => {
    let logro = 0;
    let meta = 0;
    let sum = 0;

    const objetivos = [...objectives];

    objetivos.forEach((item) => {
      logro = logro + item.logro;
      meta = meta + item.meta;
      const result = (item.logro / item.meta) * (item.peso / 100);

      sum = sum + result * 100;
    });

    return sum.toFixed(2);
  };

  const calculateTotalPerEmployeeSupervisor = () => {
    let logro = 0;
    let meta = 0;
    let sum = 0;

    const objetivos = [...objectives];

    objetivos.forEach((item) => {
      logro = logro + item.logro_supervisor;
      meta = meta + item.meta;
      const result = (item.logro_supervisor / item.meta) * (item.peso / 100);

      sum = sum + result * 100;
    });

    const resultado = sum.toFixed(2);

    return resultado;
  };

  const guardarEvaluacionAnual = () => {
    const user = sessionStorage.getItem("user");
    const supervisorId = sessionStorage.getItem("supervisorId");
    const evaluacionActual = sessionStorage.getItem("evaluacionActual");

    if (user === null) {
      return;
    }

    let employeesCopy: Employee[] = [];
    let foundIndex = 0;

    if (employees !== null) {
      employeesCopy = [...employees];
    }
    let employee: Employee = employeesCopy[0];

    //Iterates using the copy employees and set state to en_proceso
    employeesCopy.forEach((item, index) => {
      if (item.id === user) {
        foundIndex = index;
        employee = item;
        employeesCopy[foundIndex] = {
          ...employee,
          estado: EvaluationState.NoIngresada,
          evaluacionActual: "",
        };
      }
    });

    if (supervisorId !== null) {
      db.collection("perfil").doc(supervisorId).set(
        {
          colaboradores: employeesCopy,
        },
        { merge: true }
      );
    }

    db.collection("perfil").doc(user).set(
      {
        evaluacionActual: "",
      },
      { merge: true }
    );

    if (user !== null && evaluacionActual !== null) {
      db.collection("perfil")
        .doc(user)
        .collection("evaluaciones")
        .doc(evaluacionActual)
        .set(
          {
            resultado_supervisor: calculateTotalPerEmployeeSupervisor(),
            resultado_colaborador: calculateTotalPerEmployee(),
            estado: "evaluacion_completa",
          },
          { merge: true }
        );
    }

    sessionStorage.removeItem("evaluacionActual");

    history.push("/historial");
  };

  return (
    <>
      <Grid container justify="center">
        <Typography>{`Los resultados obtenidos del año ${year} fueron:`}</Typography>
      </Grid>

      <Grid container>
        {objectives.map((item, index) => (
          <Grid container justify="center" key={index}>
            <Paper style={{ padding: 20, margin: 10, width: "80%" }}>
              <Grid container>
                <Grid item xs={3}>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      marginRight: 20,
                    }}
                  >
                    Categoría.
                  </Typography>
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      marginBottom: 10,
                    }}
                  >
                    {item.categoria.replaceAll("_", " ")}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      marginRight: 20,
                    }}
                  >
                    Descripción del objetivo.
                  </Typography>
                  <Typography
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    {item.descripcion}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Meta.
                  </Typography>
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      marginBottom: 10,
                    }}
                  >
                    {item.meta}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    Peso.
                  </Typography>
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      marginBottom: 10,
                    }}
                  >
                    {`${item.peso}%`}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={3}>
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    Logro.
                  </Typography>
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      marginBottom: 10,
                    }}
                  >
                    {item.logro}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    Logro evaluado.
                  </Typography>
                  <Typography
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    {item.logro_supervisor}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Resultado personal alcanzado.
                  </Typography>
                  <Typography style={{ marginBottom: 10 }}>
                    {`${(
                      (item.logro / item.meta) *
                      100 *
                      (item.peso / 100)
                    ).toFixed(2)}%`}
                  </Typography>
                </Grid>

                <Grid item xs={3}>
                  <Typography
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    Resultado evaluado alcanzado.
                  </Typography>
                  <Typography style={{ marginBottom: 10 }}>
                    {`${(
                      (item.logro_supervisor / item.meta) *
                      100 *
                      (item.peso / 100)
                    ).toFixed(2)}%`}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={6}>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      marginRight: 20,
                    }}
                  >
                    Comentarios.
                  </Typography>
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      marginBottom: 10,
                    }}
                  >
                    {item.comentario_colaborador}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      marginRight: 20,
                    }}
                  >
                    Comentarios del supervisor
                  </Typography>
                  <Typography
                    style={{
                      textTransform: "capitalize",
                      marginBottom: 10,
                    }}
                  >
                    {item.comentario_supervisor}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {acuerdos !== "" && (
        <Grid
          container
          justify="center"
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <Paper style={{ padding: 20, width: "80%" }}>
            <Grid container>
              <Typography style={{ fontWeight: "bold" }}>
                Acuerdos del año para el colaborador
              </Typography>
            </Grid>
            <Grid container>
              <Typography>{acuerdos}</Typography>
            </Grid>
          </Paper>
        </Grid>
      )}

      <Grid
        container
        justify="center"
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <Paper style={{ padding: 20 }}>
          <Typography>
            El resultado personal de su desempeño es{" "}
            {`${calculateTotalPerEmployee()}%`}
          </Typography>

          <Typography>
            El resultado evaluado de su desempeño es{" "}
            {`${calculateTotalPerEmployeeSupervisor()}%`}
          </Typography>
        </Paper>
      </Grid>

      <Grid container justify="center">
        {estado === "evaluada" ? (
          <Button
            variant="contained"
            color="primary"
            onClick={guardarEvaluacionAnual}
          >
            Guardar evaluación anual
          </Button>
        ) : (
          <Grid container justify="center">
            <Typography>
              La evaluación actual puede ser vista en la opción "Gestionar mis
              autoevaluaciones", mientras la retroalimentación del supervisor es
              ingresada.
            </Typography>
            <Grid
              container
              justify="center"
              style={{ marginTop: 20, marginBottom: 20 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push("/inicio")}
              >
                Continuar
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
}
