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
import Objective from "./objectives/Objective";
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

interface RouteParams {
  id: string;
}

interface Props {}

function createData(
  categoria: string,
  meta: number,
  descripcion: string,
  peso: number,
  logro: number
) {
  return { categoria, meta, descripcion, peso, logro };
}

const rows = [
  createData(
    "Lorem",
    159,
    "Hi    sdasd sda asdasda da asdada asdad ad adadasd adasd asd asd ",
    24,
    4.0
  ),
  createData("Ice cream sandwich", 237, "Hi", 37, 4.3),
  createData("Eclair", 262, "Hi", 24, 6.0),
  createData("Cupcake", 305, "Hi", 67, 4.3),
  createData("Gingerbread", 356, "Hi", 49, 3.9),
];

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

  useEffect(() => {
    const validate = sessionStorage.getItem("validate");
    if (validate === "false") {
      history.push("/");
    }
  }, []);

  const testDatabase = () => {
    const employee = {
      empleado_id: "MM18054",
      usuario: "carlos@admin",
      credenciales: "mm18054",
      nombre: "Carlos",
      apellido: "Molina",
      cargo: "administrador",
      correo: "carlos@gmail.com",
      fechaCreacion: new Date().getDate(),
    };
  };

  const ingresarObjetivo = () => {
    handleOpenEmailModal();
  };

  const showTable = () => {
    return (
      <Grid container style={{ width: "80%", marginTop: 16 }}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Meta</TableCell>
                <TableCell align="right">Descripción del objetivo</TableCell>
                <TableCell align="right">Peso</TableCell>
                <TableCell align="right">Logro</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow hover={true} key={index}>
                  <TableCell scope="row">{row.categoria}</TableCell>
                  <TableCell align="right">{row.meta}</TableCell>
                  <TableCell align="right" style={{ width: 200 }}>
                    {row.descripcion}
                  </TableCell>
                  <TableCell align="right">{row.peso}</TableCell>
                  <TableCell align="right">{row.logro}</TableCell>
                  <TableCell>
                    <Grid container justify="center">
                      <Grid item>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton>
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
  };

  return (
    <>
      <Grid container justify="center" className={classes.mainContainer}>
        <Grid>
          <Typography>
            Todavia no se ha agregado ningun objetivo, seleccionar agregar
            objetivo para comenzar
          </Typography>
        </Grid>

        {showTable()}

        <Grid container justify="center" className={classes.addButton}>
          <Button
            variant="contained"
            color="primary"
            onClick={ingresarObjetivo}
          >
            Agregar Objetivo
          </Button>
        </Grid>
      </Grid>

      <Objective openModal={openModal} closeModal={handleCloseEmailModal} />
    </>
  );
}
