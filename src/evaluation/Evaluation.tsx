import { Button, Grid, Typography } from "@material-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { db } from "../firebase/firebase";

interface Props {
  user: string;
}

export default function Evaluation({ user }: Props): ReactElement {
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    const path = db
      .collection("perfil")
      .doc(user)
      .collection("evaluacion")
      .doc("2021");

    path.get().then((data) => {
      if (data.exists) {
        setApproved(data.data()!.isApproved);
      }
    });

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

  const execute = () => {
    const data = {
      id1_Objetivo: "Hacer mas cosas",
      id1_Meta: "meta Id 1",
      id2_Objetivo: "Hacer cosas 2",
      id2_Meta: "meta Id 2",
    };
    for (let key of Object.entries(data)) {
      console.log(key);
    }
  };

  return (
    <>
      <Grid container justify="center" style={{ marginTop: 120 }}>
        {showEvaluation()}
      </Grid>
      <Button onClick={execute}>Execute</Button>
    </>
  );
}
