import React, { ReactElement } from "react";
import Objectives from "./objectives/Objectives";

interface Props {}

export default function ObjectiveContainer({}: Props): ReactElement {
  return (
    <>
      <Objectives></Objectives>
    </>
  );
}
