import {
  Button,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { db } from "../firebase/firebase";
import { useHistory } from "react-router";
import { Employee } from "../interface/generic";
import { Mode } from "../interface/enums";

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
    table: {
      minWidth: 1000,
    },
  })
);

export default function SupervisorModule({}: Props): ReactElement {
  const classes = useStyles();
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const history = useHistory();

  useEffect(() => {
    const user = sessionStorage.getItem("user");

    if (user !== null) {
      db.collection("perfil")
        .doc(user)
        .get()
        .then((data) => {
          if (data.exists) {
            if (data.data() !== undefined) {
              if (data.data()!.colaboradores !== undefined) {
                setEmployees(data.data()!.colaboradores);
              }
            }
          }
        });
    }
  }, []);

  const manageEmployee = (id: string, fullname: string, mode: Mode) => {
    sessionStorage.removeItem("employeeId");
    sessionStorage.removeItem("fullname");

    sessionStorage.setItem("employeeId", id);
    sessionStorage.setItem("fullname", fullname);

    if (mode === Mode.Retroalimentar) {
      sessionStorage.removeItem("mode");
      sessionStorage.setItem("mode", mode);
    } else {
      sessionStorage.removeItem("mode");
      sessionStorage.setItem("mode", mode);
    }

    history.push("/evaluacion");
  };

  const showButton = (
    estado: string,
    id: string,
    nombre: string,
    apellido: string
  ) => {
    if (estado === "objetivos_ingresados") {
      return (
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              manageEmployee(id, `${nombre} ${apellido}`, Mode.Aprobar)
            }
          >
            Aprobar Evaluacion
          </Button>
        </Grid>
      );
    }
    if (estado === "evaluacion_completa") {
      return (
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              manageEmployee(id, `${nombre} ${apellido}`, Mode.Retroalimentar)
            }
          >
            Evaluar
          </Button>
        </Grid>
      );
    } else {
      return <Typography>Objetivos sin ingresar</Typography>;
    }
  };
  return (
    <>
      <Grid
        container
        justify="center"
        style={{ width: "80%", marginTop: 16, margin: "auto" }}
      >
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Colaborador</TableCell>
                <TableCell>Cargo</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees !== null &&
                employees.map((row) => (
                  <TableRow hover={true} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell
                      scope="row"
                      style={{ textTransform: "capitalize" }}
                    >
                      {`${row.nombre} ${row.apellido}`}
                    </TableCell>
                    <TableCell style={{ width: 200 }}>{row.cargo}</TableCell>
                    <TableCell>
                      <Grid container justify="center">
                        {showButton(
                          row.estado,
                          row.id,
                          row.nombre,
                          row.apellido
                        )}
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
