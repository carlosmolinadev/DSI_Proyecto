export interface Objective {
  id: string;
  categoria: string;
  meta: number;
  descripcion: string;
  peso: number;
  logro: number;
  logro_supervisor: number;
  comentario_colaborador: string;
  comentario_supervisor: string;
  estado_aprobacion: "sin_revisar" | "aprobado" | "denegado";
  razon_denegar: string;
}

export interface Employee {
  nombre: string;
  apellido: string;
  cargo: string;
  id: string;
  estado: string;
  evaluacionActual: string;
}

export interface ObjectiveEntity {
  objetivos: Objective[];
  nombre: string;
  apellido: string;
  cargo: string;
  id: string;
  fechaCreado: number;
  year: number;
  resultado_colaborador: string;
  resultado_supervisor: string;
}

export interface EmployeeActivity {
  nombre: string;
  apellido: string;
  cargo: string;
  empleadoId: string;
  loginTime?: number;
  logoutTime?: number;
}
