import React, { ReactElement, useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { ObjectiveEntity } from "../interface/generic";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, Grid, Paper, Typography, Collapse } from "@material-ui/core";

interface Props {}

export default function Historial({}: Props): ReactElement {
  const [objetivoEntidad, setObjetivoEntidad] = useState<ObjectiveEntity[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const selectIndex = (index: number) => {
    if (index === selectedIndex) {
      setSelectedIndex(-1);
    } else {
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    let user = sessionStorage.getItem("historialUser");

    // verficar rol para historial
    if (user === null) {
      user = sessionStorage.getItem("user");
    }

    const test = async (user: string) => {
      let objetivosData: ObjectiveEntity[] = [];
      const data = await db
        .collection("perfil")
        .doc(user)
        .collection("evaluaciones")
        .orderBy("year")
        .get();

      data.forEach((doc) => {
        if (doc.data().estado === "evaluacion_completa") {
          objetivosData.push(doc.data() as ObjectiveEntity);
        }
      });

      setObjetivoEntidad(objetivosData);
    };

    if (user !== null) {
      test(user);
    }

    sessionStorage.removeItem("historialUser");
  }, []);

  return (
    <>
      {objetivoEntidad.length === 0 ? (
        <>
          <Grid container justify="center">
            <Paper style={{ padding: 20, margin: 20 }}>
              <Typography>No tiene historial previo de evaluaciones</Typography>
            </Paper>
          </Grid>
        </>
      ) : (
        <>
          <Grid container>
            {objetivoEntidad.map((item, index) => (
              <Grid container justify="center" key={index}>
                <Paper style={{ padding: 20, margin: 10, width: "80%" }}>
                  <Grid container>
                    <Grid item xs={2}>
                      <Typography
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          marginRight: 20,
                        }}
                      >
                        Persona evaluada.
                      </Typography>
                      <Typography
                        style={{
                          textTransform: "capitalize",
                          marginBottom: 10,
                        }}
                      >
                        {`${item.nombre + " " + item.apellido}`.replaceAll(
                          "_",
                          " "
                        )}
                      </Typography>
                    </Grid>

                    <Grid item xs={2}>
                      <Typography
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          marginRight: 20,
                        }}
                      >
                        Año evaluado.
                      </Typography>
                      <Typography
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        {item.year}
                      </Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Typography
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          marginRight: 20,
                        }}
                      >
                        Resultado personal obtenido.
                      </Typography>
                      <Typography
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        {`${item.resultado_colaborador}%`}
                      </Typography>
                    </Grid>

                    <Grid item xs={3}>
                      <Typography
                        style={{
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          marginRight: 20,
                        }}
                      >
                        Resultado evaluado obtenido.
                      </Typography>
                      <Typography
                        style={{
                          marginBottom: 10,
                        }}
                      >
                        {`${item.resultado_supervisor}%`}
                      </Typography>
                    </Grid>

                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => selectIndex(index)}
                      >
                        Ver Detalles
                      </Button>
                    </Grid>

                    <Grid container>
                      <Grid item>
                        <Typography
                          style={{
                            textTransform: "capitalize",
                            fontWeight: "bold",
                            marginRight: 20,
                          }}
                        >
                          Acuerdos del año.
                        </Typography>
                        <Typography
                          style={{
                            textTransform: "capitalize",
                            marginBottom: 10,
                          }}
                        >
                          {item.acuerdos}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid>
                    <Collapse
                      in={selectedIndex === index ? true : false}
                      timeout="auto"
                      unmountOnExit
                    >
                      {objetivoEntidad[index].objetivos.map((item) => (
                        <Grid item key={item.id}>
                          <Paper style={{ padding: 20, margin: 10 }}>
                            <Grid container>
                              <Grid item xs={3}>
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                    marginRight: 20,
                                  }}
                                >
                                  Categoría.
                                </Typography>
                                <Typography
                                  style={{
                                    textTransform: "capitalize",
                                    marginBottom: 10,
                                  }}
                                >
                                  {item.categoria.replaceAll("_", " ")}
                                </Typography>
                              </Grid>

                              <Grid item xs={3}>
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                    marginRight: 20,
                                  }}
                                >
                                  Descripción del objetivo.
                                </Typography>
                                <Typography
                                  style={{
                                    marginBottom: 10,
                                  }}
                                >
                                  {item.descripcion}
                                </Typography>
                              </Grid>

                              <Grid item xs={3}>
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                  }}
                                >
                                  Meta.
                                </Typography>
                                <Typography
                                  style={{
                                    textTransform: "capitalize",
                                    marginBottom: 10,
                                  }}
                                >
                                  {item.meta}
                                </Typography>
                              </Grid>

                              <Grid item xs={3}>
                                <Typography
                                  style={{
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Peso.
                                </Typography>
                                <Typography
                                  style={{
                                    textTransform: "capitalize",
                                    marginBottom: 10,
                                  }}
                                >
                                  {`${item.peso}%`}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid item xs={3}>
                                <Typography
                                  style={{
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Logro.
                                </Typography>
                                <Typography
                                  style={{
                                    textTransform: "capitalize",
                                    marginBottom: 10,
                                  }}
                                >
                                  {item.logro}
                                </Typography>
                              </Grid>

                              <Grid item xs={3}>
                                <Typography
                                  style={{
                                    textTransform: "capitalize",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Logro evaluado.
                                </Typography>
                                <Typography
                                  style={{
                                    marginBottom: 10,
                                  }}
                                >
                                  {item.logro_supervisor}
                                </Typography>
                              </Grid>

                              <Grid item xs={3}>
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                  }}
                                >
                                  Resultado personal alcanzado.
                                </Typography>
                                <Typography style={{ marginBottom: 10 }}>
                                  {`${(
                                    (item.logro / item.meta) *
                                    100 *
                                    (item.peso / 100)
                                  ).toFixed(2)}%`}
                                </Typography>
                              </Grid>

                              <Grid item xs={3}>
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                  }}
                                >
                                  Resultado evaluado alcanzado.
                                </Typography>
                                <Typography style={{ marginBottom: 10 }}>
                                  {`${(
                                    (item.logro_supervisor / item.meta) *
                                    100 *
                                    (item.peso / 100)
                                  ).toFixed(2)}%`}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Grid container>
                              <Grid item xs={6}>
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                    marginRight: 20,
                                  }}
                                >
                                  Comentarios.
                                </Typography>
                                <Typography
                                  style={{
                                    textTransform: "capitalize",
                                    marginBottom: 10,
                                  }}
                                >
                                  {item.comentario_colaborador}
                                </Typography>
                              </Grid>

                              <Grid item xs={6}>
                                <Typography
                                  style={{
                                    fontWeight: "bold",
                                    marginRight: 20,
                                  }}
                                >
                                  Comentarios del supervisor
                                </Typography>
                                <Typography
                                  style={{
                                    textTransform: "capitalize",
                                    marginBottom: 10,
                                  }}
                                >
                                  {item.comentario_supervisor}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}
                    </Collapse>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </>
  );
}
