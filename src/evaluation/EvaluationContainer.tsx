import { Button, Grid, Typography } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { Mode } from "../interface/enums";
import { Objective } from "../interface/generic";
import Evaluation from "./Evaluation";

interface Props {}

export default function EvaluationContainer({}: Props): ReactElement {
  const [mode, setMode] = useState<Mode | null>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState("colaborador");

  const getObjectives = async (user: string | null) => {
    if (user !== null) {
      db.collection("perfil")
        .doc(user)
        .collection("evaluaciones")
        .doc("2021")
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            const data = snapshot.data();
            setObjectives(data?.objetivos);
          }
        });
    }
  };

  console.log(user);

  useEffect(() => {
    const mode = sessionStorage.getItem("mode");
    if (mode !== null) {
      setMode(mode as Mode);
    }

    if (mode === Mode.Evaluar) {
      const owner = sessionStorage.getItem("user");
      setUser(owner);
      getObjectives(owner);
    } else {
      const owner = sessionStorage.getItem("employeeId");
      getObjectives(owner);
    }

    const employee = sessionStorage.getItem("employeeId");
    if (employee !== null) {
      setUser(employee);
    }

    const role = sessionStorage.getItem("role");
    if (role !== null) {
      setRole(role);
    }

    return () => {};
  }, []);

  // const showEvaluation = () => {
  //   if (approved) {
  //     return <Typography></Typography>;
  //   } else {
  //     return (
  //       <Typography>
  //         La autoevaluación esta pendiente de ser aprobada por el supervisor
  //       </Typography>
  //     );
  //   }
  // };

  return (
    <>
      {user && mode !== null && (
        <Grid container justify="center" style={{ marginTop: 120 }}>
          <Evaluation
            objectives={objectives}
            mode={mode}
            evaluationOwner={user}
            role={role}
          />
        </Grid>
      )}
    </>
  );
}
