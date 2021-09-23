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
import { Objective } from "../interface/generic";
import { db } from "../firebase/firebase";

interface Props {}

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

export default function Results({}: Props): ReactElement {
  const classes = useStyles();
  const [objectives, setObjectives] = useState<Objective[]>([]);

  useEffect(() => {
    const user = sessionStorage.getItem("user");

    const getObjectives = async () => {
      if (user !== null) {
        db.collection("perfil")
          .doc(user)
          .collection("evaluaciones")
          .doc("2021")
          .onSnapshot((snapshot) => {
            if (snapshot.exists) {
              const data = snapshot.data();
              setObjectives(data?.objetivos);
            }
          });
      }
    };

    getObjectives();

    return () => {};
  }, []);

  const calculateTotalPerEmployee = () => {
    let logro = 0;
    let meta = 0;
    let sum = 0;
    const totalObjectives = objectives.length;

    const objetivos = [...objectives];

    objetivos.forEach((item) => {
      logro = logro + item.logro;
      meta = meta + item.meta;
      const result = (item.logro / item.meta) * (item.peso / 100);

      sum = sum + result * 100;
    });

    return (sum / totalObjectives).toFixed(2);
  };

  return (
    <>
      {objectives.length > 0 ? (
        <>
          <Grid container justify="center">
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
                        style={{
                          textTransform: "capitalize",
                          marginBottom: 10,
                        }}
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
                        style={{
                          textTransform: "capitalize",
                          marginBottom: 10,
                        }}
                      >
                        {item.descripcion}
                      </Typography>
                    </Grid>

                    <Grid container direction="column">
                      <Typography
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                        }}
                      >
                        Meta.
                      </Typography>
                      <Typography style={{ marginBottom: 10 }}>
                        {item.meta}
                      </Typography>
                    </Grid>

                    <Grid container direction="column">
                      <Typography
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Peso.
                      </Typography>
                      <Typography style={{ marginBottom: 10 }}>
                        {item.peso}
                      </Typography>
                    </Grid>

                    <Grid container direction="column">
                      <Typography
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Logro.
                      </Typography>
                      <Typography style={{ marginBottom: 10 }}>
                        {item.logro}
                      </Typography>
                    </Grid>

                    <Grid container direction="column">
                      <Typography
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        Evaluación del logro.
                      </Typography>
                      <Typography style={{ marginBottom: 10 }}>
                        {item.logro_supervisor}
                      </Typography>
                    </Grid>

                    <Grid container direction="column">
                      <Typography
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        % Alcanzado.
                      </Typography>
                      <Typography style={{ marginBottom: 10 }}>
                        {(
                          (item.logro / item.meta) *
                          100 *
                          (item.peso / 100)
                        ).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Grid container justify="center" style={{ margin: 20 }}>
            <Paper style={{ padding: 20 }}>
              <Typography>
                El resultado de su desempeño es{" "}
                {`${calculateTotalPerEmployee()}`}
              </Typography>
            </Paper>
          </Grid>
        </>
      ) : (
        <Grid container justify="center">
          <Typography>No tiene evaluaciones pendientes</Typography>
        </Grid>
      )}
    </>
  );
}
