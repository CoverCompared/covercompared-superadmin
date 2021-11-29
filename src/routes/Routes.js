import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { dashboard as dashboardRoutes, auth as authRoutes, unAuthRoutes } from "./index";

import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import Page404 from "../pages/auth/Page404";
import AuthGuard from "../components/guard/AuthGuard";
import UnAuthGuard from "../components/guard/UnAuthGuard";

const childRoutes = (Layout, routes, GuardComponent) =>
  routes.map(({ children, path, component: Component }, index) =>
    children ? (
      // Route item with children
      children.map(({ path, component: Component }, index) => (
        <Route
          key={index}
          path={path}
          exact
          component={() => <GuardComponent component={<Layout> <Component /> </Layout>} />}
        />
      ))
    ) : (
      // Route item without children
      <Route
        key={index}
        path={path}
        exact
        component={() => <GuardComponent component={<Layout> <Component /> </Layout>} />}
      />
    )
  );

const Routes = () => (
  <Router basename={process.env.PUBLIC_URL}>
    <Switch>
      {childRoutes(DashboardLayout, dashboardRoutes, AuthGuard)}
      {childRoutes(AuthLayout, authRoutes, AuthGuard)}
      {childRoutes(AuthLayout, unAuthRoutes, UnAuthGuard)}
      <Route
        render={() => (
          <AuthLayout>
            <Page404 />
          </AuthLayout>
        )}
      />
    </Switch>
  </Router>
);

export default Routes;
