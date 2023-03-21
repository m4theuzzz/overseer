import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import TransactionsDisplay from "../../components/TransactionsDisplay";
import { useServices } from "../../hooks/useServices";
import Graph from '../../components/Graph';
import * as S from "./styles";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardGraphs, setDashboardGraps] = useState([]);

  const getData = async () => {
    const incomingMargin = await useServices(
      "reports",
      "GET",
      null,
      null,
      null,
      "incomingMargin"
    );

    const transactionsReport = await useServices(
      "reports",
      "GET",
      null,
      null,
      null,
      "transactionsReport"
    );

    const transactionsReportByMonth = await useServices(
      "reports",
      "GET",
      null,
      null,
      null,
      "transactionsReportByMonth"
    );

    const budgetsByMonth = await useServices(
      "reports",
      "GET",
      null,
      null,
      null,
      "budgetsByMonth"
    );

    setDashboardGraps([
      ...dashboardGraphs,
      {
        title: "Histórico de Entradas e Saídas por mês",
        xLabel: "Mês",
        yLabel: "Entradas/Saídas",
        data: transactionsReportByMonth,
        xField: 'month',
        yField: 'incoming',
        y2Field: 'outcoming'
      },
      {
        title: "Novos Orçamentos por mês",
        xLabel: "Mês",
        yLabel: "Orçamentos",
        data: budgetsByMonth,
        xField: 'month',
        yField: 'total'
      }
    ]);

    console.log(transactionsReportByMonth)

    setDashboardData([
      ...dashboardData,
      {
        type: "number",
        value: incomingMargin.average,
        displayText: incomingMargin.average + "%",
        color: 'green',
        label: "Taxa de Administração média",
      },
      {
        type: "number",
        value: transactionsReport.incoming,
        displayText: "R$ " + transactionsReport.incoming,
        color: 'green',
        label: "Receitas",
      },
      {
        type: "number",
        value: transactionsReport.outcoming,
        displayText: "R$ " + transactionsReport.outcoming,
        color: 'red',
        label: "Despesas",
      },
      {
        type: "number",
        value: transactionsReport.liquid,
        displayText: "R$ " + transactionsReport.liquid,
        color: transactionsReport.liquid <= 0 ? 'red' : 'green',
        label: transactionsReport.liquid <= 0 ? "Prejuízo" : "Lucro",
      },
    ]);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <S.Wrapper>
      <S.Container>
        <S.Cards4Row>
          {dashboardData.map((item) => (
            <Card title={item.label}>
              <S.CardText color={item.color}>{item.displayText}</S.CardText>
            </Card>
          ))}
        </S.Cards4Row>
        <S.Cards2Row>
          {dashboardGraphs.map(item => {
            return (
              <Card title={item.title}>
                <Graph xField={item.xField} yField={item.yField} data={item.data} xLabel={item.xLabel} yLabel={item.yLabel} y2Field={item.y2Field} />
              </Card>
            )
          })}
        </S.Cards2Row>
      </S.Container>
    </S.Wrapper>
  );
};

export default Dashboard;
