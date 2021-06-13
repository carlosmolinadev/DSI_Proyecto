import React from "react";
import { Route, Switch } from "react-router-dom";

import "./App.css";
import Header from "./common/header/Header";
import ObjectiveContainer from "./dashboard/ObjectiveContainer";
import Login from "./login/Login";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <Login />
      </Route>

      <Route exact path="/eval">
        <Header />
        <ObjectiveContainer />
      </Route>
    </Switch>
  );
}

export default App;
