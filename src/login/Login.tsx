import React, { ReactElement } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Button, FormControl, Grid, Paper, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";

interface Props {}

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
  const { register, handleSubmit, errors, control, setValue } = useForm();

  return (
    <Grid container justify="center" className={classes.mainContainer}>
      <Paper className={classes.paper}>
        <Grid container style={{ marginTop: 16, marginBottom: 16 }}>
          <Typography>
            Especifique usuario y contraseña válidos para la aplicación
          </Typography>
        </Grid>

        <Grid container justify="center">
          <FormControl className={classes.formControl}>
            <TextField
              label="Usuario*"
              variant="outlined"
              inputRef={register}
              name="title"
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
            />
          </FormControl>
        </Grid>

        <Grid container justify="center">
          <Button variant="contained" color="primary">
            Ingresar
          </Button>
        </Grid>
      </Paper>
    </Grid>
  );
}
