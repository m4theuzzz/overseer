import React, { useState } from "react";
import * as S from "./styles";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Modal from "../../components/Modal";
import { useServices } from "../../hooks/useServices";
import TransactionsForm from "./form";
import FormModal from "../../components/FormModal";
import Table from "../../components/Table";
import PageHeader from "../../components/PageHeader";
import Card from "../../components/Card";

const Transactions = () => {
  const [modal, setModal] = useState({
    open: false,
    info: "",
    action: () => { },
  });

  const [formModal, setFormModal] = useState({
    open: false,
    info: "",
    title: "",
    action: () => { },
  });

  const [transactions, setTransactions] = useState([]);
  const [dashboardData, setDashboardData] = useState([]);


  const handleDelete = async (id) => {
    const res = await useServices('transactions', 'DELETE', id);
    if (res.status == 200) {
      toast.success('Transação excluída com sucesso')
      setModal({
        open: false,
        info: "",
        title: "",
        action: () => { },
      });
      loadTransactions();
    } else {
      toast.error('Erro ao excluir transação')
    }
  };

  const loadTransactions = async () => {
    const res = await useServices('transactions', 'GET');

    if (res) {
      setTransactions(res);
    }
  };

  useEffect(() => {
    loadTransactions();
    getData();
  }, []);

  const actions = {
    onEdit: (row) => {
      setFormModal({
        open: true,
        info: row.id,
        title: "Editar Transação",
        action: () => loadTransactions()
      })
    },
    onDelete: (row) => {
      setModal({
        open: true,
        info: row.name,
        title: "Excluir Transação",
        action: () => handleDelete(row.id),
      })
    },
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: `50px`,
    },
    {
      field: "name",
      headerName: "Nome",
      width: `200px`,
    },

    {
      field: "value",
      headerName: "Valor",
      width: `100px`,
    },
    {
      field: "type",
      headerName: "Tipo",
      width: `100px`,
      renderCell: (value) => {
        switch (value) {
          case "incoming":
            return "entrada";

          case "outcoming":
            return "saída";

          default:
            return value;
        }
      }
    },
    {
      field: "description",
      headerName: "Descrição",
      width: `200px`,
    },
  ];

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

    setDashboardData([
      ...dashboardData,
      {
        type: "number",
        value: (transactionsReport.liquid * 100 / transactionsReport.outcoming),
        displayText: (transactionsReport.liquid * 100 / transactionsReport.outcoming).toFixed(1) + "%",
        color: transactionsReport.liquid <= 0 ? 'red' : 'green',
        label: "Margem de lucro média",
      },
      {
        type: "number",
        value: transactionsReport.incoming,
        displayText: "R$ " + transactionsReport.incoming,
        color: 'green',
        label: "Receitas Totais",
      },
      {
        type: "number",
        value: transactionsReport.outcoming,
        displayText: "R$ " + transactionsReport.outcoming,
        color: 'red',
        label: "Despesas Totais",
      },
      {
        type: "number",
        value: transactionsReport.liquid,
        displayText: "R$ " + transactionsReport.liquid,
        color: transactionsReport.liquid <= 0 ? 'red' : 'green',
        label: transactionsReport.liquid <= 0 ? "Prejuízo Total" : "Lucro Total",
      },
    ]);
  };

  return (
    <S.Wrapper>
      <PageHeader title='Financeiro' subtitle='lista' />
      <S.CardWrapper>
        {dashboardData.map((item) => (
          <Card title={item.label} centeredValue={true}>
            <S.CardText color={item.color}>{item.displayText}</S.CardText>
          </Card>
        ))}
      </S.CardWrapper>
      <Button
        floatRight={true}
        onButtonClick={() => {
          setFormModal({
            open: true,
            info: null,
            title: "Adicionar Transação",
            action: () => loadTransactions()
          })
        }}
      >+ Transação</Button>
      <Modal modal={modal} setModal={setModal} />
      <FormModal modal={formModal} setModal={setFormModal} Form={TransactionsForm} />
      <Table
        rows={transactions}
        columns={columns}
        actions={actions}
        search={true}
      />
    </S.Wrapper>
  );
};

export default Transactions;
