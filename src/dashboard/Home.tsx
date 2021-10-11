import { Button, Grid } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../firebase/firebase";

interface Props {}

interface Profile {
  rol: string;
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
        rol: information.rol,
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
          Gestionar mis autoevaluaciones
        </Button>

        <Button
          color="primary"
          variant="contained"
          style={{ marginLeft: 10, marginRight: 10 }}
          onClick={() => history.push("/historial")}
        >
          Historial
        </Button>

        {profile?.rol === "supervisor" && (
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: 10, marginRight: 10 }}
            onClick={() => history.push("/gestion-personas")}
          >
            Gestionar Evaluaciones de Colaboradores
          </Button>
        )}
      </Grid>
    </>
  );
}
