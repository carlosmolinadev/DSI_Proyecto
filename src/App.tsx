import React from "react";
import { Route, Switch } from "react-router-dom";

import "./App.css";
import Header from "./common/header/Header";
import ObjectiveContainer from "./dashboard/ObjectiveContainer";
import ObjectiveDetails from "./dashboard/objectives/ObjectiveDetails";
import Login from "./login/Login";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import Evaluation from "./evaluation/Evaluation";
import Home from "./dashboard/Home";
import EvaluationContainer from "./evaluation/EvaluationContainer";
import SupervisorModule from "./supervisor/SupervisorModule";

function App() {
  return (
    <>
      <ReactNotification />
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>

        <Route exact path="/inicio">
          <Header />
          <Home />
        </Route>

        <Route exact path="/objetivos">
          <Header module="objetivos" />
          <ObjectiveContainer />
        </Route>

        <Route exact path="/evaluacion">
          <Header module="evaluacion" />
          <EvaluationContainer />
        </Route>

        <Route exact path="/gestion-personas">
          <Header module="gestion" />
          <SupervisorModule />
        </Route>
      </Switch>
    </>
  );
}

export default App;
