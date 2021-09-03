import { Button, Grid } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase/firebase";

interface Props {}

interface Profile {
  cargo: string;
  nombre: string;
  apellido: string;
}

export default function Home({}: Props): ReactElement {
  const history = useHistory();
  const [profile, setProfile] = useState<Profile | null>();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    const data = db.collection("perfil").doc(user!).get();
    data.then((data) => {
      const information = data.data()!;
      setProfile({
        cargo: information.cargo,
        nombre: information.nombre,
        apellido: information.apellido,
      });
    });
  }, []);

  return (
    <>
      <Grid container justify="center" style={{ marginTop: 120 }}>
        <Button
          color="primary"
          variant="contained"
          style={{ marginLeft: 10, marginRight: 10 }}
          onClick={() => history.push("/objetivos")}
        >
          Agregar Objetivos
        </Button>

        <Button
          color="primary"
          variant="contained"
          style={{ marginLeft: 10, marginRight: 10 }}
          onClick={() => history.push("/evaluacion")}
        >
          Realizar Autoevaluación
        </Button>

        {profile?.cargo === "administrador" && (
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: 10, marginRight: 10 }}
          >
            Gestionar Evaluaciones de Colaboradores
          </Button>
        )}
      </Grid>
    </>
  );
}
