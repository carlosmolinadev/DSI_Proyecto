export enum Mode {
  Aprobar = "APROBAR",
  Evaluar = "EVALUAR",
  Retroalimentar = "RETROALIMENTAR",
  Crear = "CREADO",
}

export enum EvaluationState {
  NoIngresada = "no_ingresada",
  ObjetivosIngresados = "objetivos_ingresados",
  Completa = "evaluacion_completa",
  Retroalimentacion = "retroalimentacion",
  IngresarObjetivos = "ingresar_objetivos",
  SinObjetivos = "sin_objetivos",
  EnProceso = "en_proceso",
  Evaluada = "evaluada",
}
