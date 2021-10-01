import React, { ReactElement, useEffect } from "react";
import { Objective } from "../interface/generic";

interface Props {
  employeeId: string;
  employeeObjectives: Objective[];
}

export default function SupervisorReview({
  employeeId,
  employeeObjectives,
}: Props): ReactElement {
  useEffect(() => {}, []);

  return <div>CAMBIO</div>;
}
