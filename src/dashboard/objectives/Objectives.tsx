import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement } from "react";

interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainContainer: {
      marginTop: 100,
    },
    addButton: {
      marginTop: 16,
      marginBottom: 16,
    },
  })
);

export default function Objectives({}: Props): ReactElement {
  const classes = useStyles();

  return (
    <Grid container justify="center" className={classes.mainContainer}>
      <Grid>
        <Typography>
          Todavia no se ha agregado ningun objetivo, seleccione agregar objetivo
          para comenzar
        </Typography>
      </Grid>

      <Grid container justify="center" className={classes.addButton}>
        <Button variant="contained" color="primary">
          Ingresar Objetivos
        </Button>
      </Grid>
    </Grid>
  );
}
