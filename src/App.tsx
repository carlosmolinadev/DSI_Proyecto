import React from "react";
import { Route, Switch } from "react-router-dom";

import "./App.css";
import Header from "./common/header/Header";
import ObjectiveContainer from "./dashboard/ObjectiveContainer";
import ObjectiveDetails from "./dashboard/objectives/ObjectiveDetails";
import Login from "./login/Login";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

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
          <ObjectiveContainer />
        </Route>
      </Switch>
    </>
  );
}

export default App;
