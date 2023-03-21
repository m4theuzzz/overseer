import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./templates/Layout";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Services from "./pages/Services";
import Transactions from "./pages/Transactions";
import Construction from "./pages/Constructions";

import UsersForm from "./pages/Users/form";
import Clients from "./pages/Clients";
import ClientsForm from "./pages/Clients/form";
import ServicesForm from "./pages/Services/form";
import TransactionsForm from "./pages/Transactions/form";
import ConstructionForm from "./pages/Constructions/form";
import Budgets from "./pages/Budgets";
import BudgetsForm from "./pages/Budgets/forms/form";
import BudgetsView from "./pages/Budgets/view";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
export const AppRoutes = () => {
  const [perm, setPerm] = useState(true)

  useEffect(() => {
    const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
    const hasPermission = userInfo && userInfo.permissionLevel >= 7 ? true : false;
    !!userInfo && setPerm(hasPermission);
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Login />}></Route>
      </Routes>
      <Layout perm={perm}>
        <Routes>
          {perm ?
            <>
              <Route path="/services" exact element={<Services />}></Route>
              <Route path="/services/new" exact element={<ServicesForm />}></Route>
              <Route path="/services/:paramId" exact element={<ServicesForm />}></Route>
              <Route path="/users" exact element={<Users />}></Route>
              <Route path="/users/new" exact element={<UsersForm />}></Route>
              <Route path="/users/:paramId" exact element={<UsersForm />}></Route>
              <Route path="/clients" exact element={<Clients />}></Route>
              <Route path="/clients/new" exact element={<ClientsForm />}></Route>
              <Route path="/clients/:paramId" exact element={<ClientsForm />}></Route>
              <Route path="/constructions" exact element={<Construction />}></Route>
              <Route path="/constructions/new" exact element={<ConstructionForm />}></Route>
              <Route path="/constructions/:paramId" exact element={<ConstructionForm />}></Route>
              <Route path="/budgets" exact element={<Budgets />}></Route>
              <Route path="/budgets/new" exact element={<BudgetsForm />}></Route>
              <Route path="/budgets/:paramId" exact element={<BudgetsView />}></Route>
              <Route path="/transactions" exact element={<Transactions />}></Route>
              <Route path="/transactions/:paramId" exact element={<TransactionsForm />}></Route>
              <Route path="/dashboard" exact element={<Dashboard />}></Route>
              <Route path="/transactions/new" exact element={<TransactionsForm />}></Route>
            </>
            :
            <Route path="/transactions/new" exact element={<TransactionsForm />}></Route>
          }
        </Routes>
      </Layout>
    </Router>
  );
};
