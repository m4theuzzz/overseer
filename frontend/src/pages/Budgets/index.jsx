import React, { useState } from "react";
import * as S from "./styles";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Modal from "../../components/Modal";
import FormModal from "../../components/FormModal";
import { useServices } from "../../hooks/useServices";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import BudgetsForm from "./forms/form";

const Budgets = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    open: false,
    info: "",
    title: "",
    action: () => { },
  });

  const [formModal, setFormModal] = useState({
    open: false,
    info: "",
    title: "",
    action: () => { },
  });
  const [budgets, setBudgets] = useState([]);

  const handleDelete = async (id) => {
    const res = await useServices("budgets", "DELETE", id);

    if (res.status == 200) {
      toast.success("Orçamento excluído com sucesso");
      setModal({
        open: false,
        info: "",
        title: "",
        action: () => { },
      });
      loadBudgets();
    } else {
      toast.error("Erro ao excluir cliente");
    }
  };

  const translateStatus = (stat) => {
    if (stat == "budget") {
      return "Orçando";
    }
    if (stat == "construction") {
      return "Em andamento";
    }
    if (stat == "finished") {
      return "Concluída";
    }
  }

  const loadBudgets = async () => {
    const budgets = await useServices("budgets", "GET");
    const constructions = await useServices("constructions", "GET");
    const clients = await useServices("clients", "GET");
    const res = budgets.map(budget => {
      const client = clients.find(client => client.id == budget.clientId);
      return {
        ...budget,
        construction: constructions.find(construct => construct.id == budget.constructionId).name,
        client: client.name,
        street: `${client.address.street}, ${client.address.number}`
      }
    });

    if (res) {
      setBudgets(res);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const actions = {
    onEdit: (row) => navigate(`/budgets/${row.id}`),
    onDelete: (row) => {
      setModal({
        open: true,
        info: row.name,
        title: "Excluir Orçamento",
        action: () => handleDelete(row.id),
      })
    },
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: `50px`
    },
    {
      field: "name",
      headerName: "Nome do Orçamento",
      width: `200px`,
    },
    {
      field: "client",
      headerName: "Cliente",
      width: `150px`,
    },
    {
      field: "construction",
      headerName: "Obra",
      width: `150px`,
    },
    {
      field: "street",
      headerName: "Endereço",
      width: `200px`,
    }
  ];

  return (
    <S.Wrapper>
      <PageHeader title="Orçamentos" subtitle="lista" />
      <div>
        <Button
          floatRight={true}
          onButtonClick={() => {
            setFormModal({
              open: true,
              info: null,
              title: "Adicionar Orçamento",
              action: () => loadBudgets()
            })
          }}
        >+ Orçamento</Button>
      </div>
      <FormModal modal={formModal} setModal={setFormModal} Form={BudgetsForm} />
      <Modal modal={modal} setModal={setModal} />
      <Table
        rows={budgets}
        columns={columns}
        actions={actions}
        search={true}
      />
    </S.Wrapper>
  );
};

export default Budgets;
