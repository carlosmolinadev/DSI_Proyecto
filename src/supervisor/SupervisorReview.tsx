import React, { ReactElement, useEffect } from "react";

interface Props {
  employeeId: string;
  employeeObjectives: Objective[];
}

export interface Objective {
  id: string;
  categoria: string;
  meta: number;
  descripcion: string;
  peso: number;
}

export default function SupervisorReview({
  employeeId,
  employeeObjectives,
}: Props): ReactElement {
  useEffect(() => {}, []);

  return <div></div>;
}
