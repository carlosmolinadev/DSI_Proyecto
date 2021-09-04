import { Button, Grid, Typography } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { Objective } from "../interface/generic";
import Evaluation from "./Evaluation";

interface Props {
  user: string;
}

export default function EvaluationContainer({ user }: Props): ReactElement {
  const [approved, setApproved] = useState(false);
  const [objectives, setObjectives] = useState<Objective[]>([]);

  useEffect(() => {
    const getObjectives = async () => {
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

    getObjectives();

    return () => {};
  }, []);

  const showEvaluation = () => {
    if (approved) {
      return <Typography></Typography>;
    } else {
      return (
        <Typography>
          La autoevaluación esta pendiente de ser aprobada por el supervisor
        </Typography>
      );
    }
  };

  return (
    <>
      <Grid container justify="center" style={{ marginTop: 120 }}>
        <Evaluation objectives={objectives} mode={"evaluacion"} />
      </Grid>
    </>
  );
}
