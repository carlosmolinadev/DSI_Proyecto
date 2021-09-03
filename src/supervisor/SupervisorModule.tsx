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
import React, { ReactElement } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import VisibilityIcon from "@material-ui/icons/Visibility";

interface Props {
  subordinates: Employee[];
}

interface Employee {
  name: string;
  position: string;
  employeeId: string;
  email: string;
}

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

export default function SupervisorModule({
  subordinates,
}: Props): ReactElement {
  const classes = useStyles();

  const editObjective = () => {};
  return (
    <>
      <Grid container style={{ width: "80%", marginTop: 16 }}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Categoría</TableCell>
                <TableCell align="right">Colaborador</TableCell>
                <TableCell align="right">Descripción del objetivo</TableCell>
                <TableCell align="right">Peso%</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {objectives.map((row) => (
                <TableRow hover={true} key={row.id}>
                  <TableCell
                    scope="row"
                    style={{ textTransform: "capitalize", width: 150 }}
                  >
                    {row.categoria.replaceAll("_", " ")}
                  </TableCell>
                  <TableCell align="right">{row.meta}</TableCell>
                  <TableCell align="right" style={{ width: 200 }}>
                    {row.descripcion}
                  </TableCell>
                  <TableCell align="right">{row.peso}</TableCell>
                  <TableCell>
                    <Grid container justify="center">
                      <Grid item>
                        <IconButton onClick={() => editObjective(row)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
}
