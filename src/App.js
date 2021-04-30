import React from "react";

import { ProvideAuth } from "./db/use-auth";
import { usuarioActual } from "./db/auth";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";



/* Import de paginas*/
import INDEX from "./app/index";
import CONDUCTOR_HOME from "./app/conductor/Conductor_home";
import CONDUCTOR_VIAJES from "./app/conductor/Conductor_viajes";

import ADMIN_HOME from "./app/admin/VISTA_ADMIN_HOME/Vista_admin_home";
import ADMIN_CONDUCTORES from "./app/admin/VISTA_ADMIN_USUARIO/Vista_admin_usuarios";
import ADMIN_CAMIONES from "./app/admin/VISTA_ADMIN_CAMION/Vista_admin_camiones";
import ADMIN_VIAJES from "./app/admin/VISTA_ADMIN_VIAJE/Vista_admin_viajes";
import ADMIN_EMPRESAS from "./app/admin/VISTA_ADMIN_EMPRESA/Vista_admin_empresas";

function App() {
  usuarioActual();

  return (
    <div className="App">
      <ProvideAuth>
        <Router>
          <Switch>
            <Route path="/" exact component={(props) => <INDEX {...props} />} />

            {/**ROUTE PARA CONDUCTOR */}
            <PrivateRouteConductor path="/conductor/home">
              <CONDUCTOR_HOME />
            </PrivateRouteConductor>

            <PrivateRouteConductor path="/conductor/viajes">
              <CONDUCTOR_VIAJES />
            </PrivateRouteConductor>

            {/**ROUTE PARA ADMIN */}

            <PrivateRoute path="/admin/home">
              <ADMIN_HOME />
            </PrivateRoute>

            <PrivateRoute path="/admin/conductores">
              <ADMIN_CONDUCTORES />
            </PrivateRoute>

            <PrivateRoute path="/admin/camiones">
              <ADMIN_CAMIONES />
            </PrivateRoute>

            <PrivateRoute path="/admin/viajes">
              <ADMIN_VIAJES />
            </PrivateRoute>

            <PrivateRoute path="/admin/empresa">
              <ADMIN_EMPRESAS />
            </PrivateRoute>

          </Switch>
        </Router>
      </ProvideAuth>
    </div>
  );

  function PrivateRoute({ children, ...rest }) {
    let auth = localStorage.getItem("user");
    let isAdmin = localStorage.getItem("isAdmin");

    console.log("ADMIN??? " + isAdmin);
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth ? (
            isAdmin === "true" ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: "/conductor/home",
                  state: { code: "100", from: location },
                }}
              />
            )
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { code: "100", from: location },
              }}
            />
          )
        }
      />
    );
  }

  function PrivateRouteConductor({ children, ...rest }) {
    let auth = localStorage.getItem("user");
    let isAdmin = localStorage.getItem("isAdmin");

    console.log("ADMIN??? " + isAdmin);
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth ? (
            isAdmin === "true" ? (
              <Redirect
                to={{
                  pathname: "/admin/home",
                  state: { code: "100", from: location },
                }}
              />
            ) : (
              children
            )
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { code: "100", from: location },
              }}
            />
          )
        }
      />
    );
  }
}

export default App;
