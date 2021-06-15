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
import { db } from "../firebase/firebase";

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

interface Objective {
  id: string;
  categoria: string;
  meta: number;
  descripcion: string;
  peso: number;
  logro: number;
}

interface Props {}

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

  const [objectives, setObjectives] = useState<Objective[]>([]);

  useEffect(() => {
    const validate = sessionStorage.getItem("validate");
    if (validate === "false") {
      history.push("/");
    }
  }, [history]);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const getObjectives = async () => {
      if (user !== null) {
        db.collection("perfil")
          .doc(user)
          .collection("objetivos")
          .onSnapshot((docs) => {
            const objectivesCopy: Objective[] = [];
            docs.forEach((item) => {
              const modifyObjective = { ...item.data(), id: item.id };
              objectivesCopy.push(modifyObjective as Objective);
            });
            setObjectives(objectivesCopy);
          });
      }
    };

    getObjectives();
  }, []);

  const deleteItem = (id: string) => {
    const user = sessionStorage.getItem("user");
    db.collection("perfil").doc(user!).collection("objetivos").doc(id).delete();
  };

  const testDatabase = () => {
    const employee = {
      empleado_id: "GF18005",
      usuario: "efrain@admin",
      credenciales: "GF18005",
      nombre: "Efrain",
      apellido: "Gomez",
      cargo: "administrador",
      correo: "efrain@gmail.com",
      fechaCreacion: new Date().getDate(),
    };
    db.collection("perfil")
      .doc("GF18005")
      .set({ ...employee });
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
              {objectives.map((row) => (
                <TableRow hover={true} key={row.id}>
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
                        <IconButton onClick={testDatabase}>
                          <EditIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => deleteItem(row.id)}>
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
