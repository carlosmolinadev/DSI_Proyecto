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
import { db } from "../firebase/firebase";
import { Objective } from "../interface/generic";

interface Props {
  objectives: Objective[];
  mode: "revision" | "evaluacion";
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
      width: 250,
    },
  })
);

export default function Evaluation({ objectives, mode }: Props): ReactElement {
  const classes = useStyles();
  const [disableInput, setDisableInput] = useState(false);

  const evaluationForm = () => {
    if (mode === "revision") {
      return (
        <>
          {objectives.map((item) => (
            <Grid item>
              <Paper key={item.id} style={{ padding: 20, marginTop: 20 }}>
                <Grid container direction="column">
                  <Typography style={{ textTransform: "capitalize" }}>
                    Categoria: {item.categoria.replaceAll("_", " ")}
                  </Typography>

                  <Typography>
                    Descripción del objetivo: {item.descripcion}
                  </Typography>

                  <Typography>Meta: {item.meta}</Typography>

                  <Typography>Peso: {item.meta}</Typography>
                </Grid>
              </Paper>
            </Grid>
          ))}

          <Grid style={{ marginTop: 20 }}>
            <Button
              style={{ marginRight: 20 }}
              variant="contained"
              color="primary"
            >
              Aprobar
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              variant="contained"
              color="secondary"
            >
              Denegar
            </Button>
          </Grid>
        </>
      );
    } else {
      return (
        <>
          {objectives.map((item, index) => (
            <Grid item>
              <Paper key={item.id} style={{ padding: 20, marginTop: 20 }}>
                <Grid container direction="column">
                  <Typography
                    style={{ textTransform: "capitalize", marginBottom: 10 }}
                  >
                    Categoria: {item.categoria.replaceAll("_", " ")}
                  </Typography>

                  <Typography style={{ marginBottom: 10 }}>
                    Descripción del objetivo: {item.descripcion}
                  </Typography>

                  <Typography style={{ marginBottom: 10 }}>
                    Meta: {item.meta}
                  </Typography>

                  <Typography style={{ marginBottom: 10 }}>
                    Peso: {item.meta}
                  </Typography>

                  <Grid container className={classes.formControl}>
                    <FormControl>
                      <TextField
                        className={classes.input}
                        label="Logro*"
                        variant="outlined"
                        name="logro"
                      />
                    </FormControl>
                  </Grid>

                  <Grid container className={classes.formControl}>
                    <FormControl>
                      <TextField
                        className={classes.input}
                        label="Comentarios*"
                        variant="outlined"
                        name="comentarios"
                        multiline
                      />
                    </FormControl>
                  </Grid>

                  <Grid container justify="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => console.log(item.id)}
                    >
                      Editar
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </>
      );
    }
  };
  return (
    <>
      <Grid container alignItems="center" direction="column">
        {evaluationForm()}
      </Grid>
    </>
  );
}
