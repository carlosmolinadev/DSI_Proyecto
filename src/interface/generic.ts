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
}
