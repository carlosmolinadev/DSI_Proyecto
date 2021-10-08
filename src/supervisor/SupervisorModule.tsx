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
import React, { ReactElement, useEffect, useState } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { db } from "../firebase/firebase";
import { useHistory } from "react-router";
import { Employee } from "../interface/generic";
import { EvaluationState, Mode } from "../interface/enums";
import { notificationFunction } from "../common/notifications/notifications";

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
  const [evaluationYear, setEvaluationYear] = useState<
    { id: string; estado: string; anio: string }[]
  >([]);

  useEffect(() => {
    const user = sessionStorage.getItem("user");

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

    const test = async (user: string) => {
      const data = await db
        .collection("perfil")
        .doc("EM06020")
        .collection("evaluaciones")
        .orderBy("year")
        .get();
      data.forEach((doc) => console.log(doc.data()));
    };

    test("EMMMSADASd");

    if (user !== null) {
      getEmployees(user);
    }
  }, []);

  const yearList = [
    "2021",
    "2022",
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
  ];

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

  const createEvaluation = (id: string) => {
    const user = sessionStorage.getItem("user");
    if (user === null) {
      return;
    }

    let employeesCopy: Employee[] = [];
    let foundIndex = 0;

    if (employees !== null) {
      employeesCopy = [...employees];
    }
    let employee: Employee = employeesCopy[0];

    employeesCopy.forEach((item, index) => {
      if (item.id === id) {
        foundIndex = index;
        employee = item;
        employeesCopy[foundIndex] = {
          ...employee,
          estado: EvaluationState.EnProceso,
        };
      }
    });

    const evaluationForm = evaluationYear[foundIndex];

    db.collection("perfil")
      .doc(employee.id)
      .collection("evaluaciones")
      .doc(evaluationForm.anio)
      .set({
        nombre: employee.nombre,
        apellido: employee.apellido,
        cargo: employee.cargo,
        id: employee.id,
        objetivos: [],
        estado: EvaluationState.EnProceso,
        year: evaluationForm.anio,
        fechaCreado: Date.now(),
      });

    // db.collection("perfil").doc(user).set(
    //   {
    //     colaboradores: employeesCopy,
    //   },
    //   { merge: true }
    // );

    notificationFunction(
      "Evaluación creada",
      "La evaluación anual ha sido creada exitosamente.",
      "success"
    );
    return;
  };

  const handleChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    index: number,
    id: string
  ) => {
    let evaluationState = [...evaluationYear];
    const anio = event.target.value as string;
    evaluationState[index] = { id, estado: "CREADO", anio };
    setEvaluationYear(evaluationState);
  };

  const showButton = (
    estado: string,
    id: string,
    nombre: string,
    apellido: string
  ) => {
    if (estado === EvaluationState.NoIngresada) {
      return (
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => createEvaluation(id)}
          >
            Crear
          </Button>
        </Grid>
      );
    }

    if (estado === EvaluationState.ObjetivosIngresados) {
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
    if (estado === EvaluationState.Completa) {
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
    }

    if (estado === EvaluationState.EnProceso) {
      return (
        <Grid item>
          <Button variant="contained" color="primary" disabled>
            Crear
          </Button>
        </Grid>
      );
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
                <TableCell align="center">Asignar Evaluación</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees !== null &&
                employees.map((row, index) => (
                  <TableRow hover={true} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell
                      scope="row"
                      style={{ textTransform: "capitalize" }}
                    >
                      {`${row.nombre} ${row.apellido}`}
                    </TableCell>
                    <TableCell style={{ width: 200 }}>{row.cargo}</TableCell>
                    <TableCell align="center">
                      <Select
                        label="Año"
                        onChange={(e) => handleChange(e, index, row.id)}
                        defaultValue={"2021"}
                      >
                        {yearList.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
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
