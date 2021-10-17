import React, { ReactElement, useEffect, useState } from "react";
import {
  Button,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Theme,
  Typography,
} from "@material-ui/core";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { db } from "../firebase/firebase";
import { EmployeeActivity } from "../interface/generic";

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

export default function ActivityHistorial({}: Props): ReactElement {
  const classes = useStyles();
  const user = sessionStorage.getItem("user");
  const [employees, setEmployees] = useState<EmployeeActivity[]>([]);

  useEffect(() => {
    db.collection("perfil")
      .where("supervisorId", "==", user)
      .onSnapshot((snapshot) => {
        let tempArray: EmployeeActivity[] = [];
        snapshot.docs.forEach((doc) =>
          tempArray.push(doc.data() as EmployeeActivity)
        );

        setEmployees(tempArray);
      });
  }, []);

  const onLineOffline = (id: string) => {
    const employeeCopy = [...employees];
    let status = "Desconectado";

    employeeCopy.forEach((item) => {
      if (item.empleadoId === id) {
        if (item.logoutTime === 0) {
          status = "En Linea";
        }
      }
    });

    return status;
  };

  const getLastAccess = (id: string) => {
    const employeeCopy = [...employees];
    let lastAccess = new Date().toString();

    employeeCopy.forEach((item) => {
      if (item.empleadoId === id) {
        if (item.logoutTime === 0) {
          lastAccess = new Date(item.loginTime!).toLocaleString();
        } else {
          lastAccess = new Date(item.logoutTime!).toLocaleString();
        }
      }
    });

    return lastAccess;
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
                <TableCell>Ultimo acceso</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees !== null &&
                employees.map((row, index) => (
                  <TableRow hover={true} key={row.empleadoId}>
                    <TableCell>{row.empleadoId}</TableCell>
                    <TableCell
                      scope="row"
                      style={{ textTransform: "capitalize" }}
                    >
                      {`${row.nombre} ${row.apellido}`}
                    </TableCell>
                    <TableCell style={{ textTransform: "capitalize" }}>
                      {row.cargo}
                    </TableCell>
                    <TableCell>{getLastAccess(row.empleadoId)}</TableCell>
                    <TableCell>{onLineOffline(row.empleadoId)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
