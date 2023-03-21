import React, { useState } from "react";
import * as S from "./styles";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import Modal from "../../components/Modal";
import FormModal from "../../components/FormModal";
import { useServices } from '../../hooks/useServices';
import ClientsForm from "./form";
import Table from "../../components/Table";
import PageHeader from "../../components/PageHeader";

const Clients = () => {
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
  const [clients, setClients] = useState([]);

  const handleDelete = async (id) => {
    const res = await useServices('clients', 'DELETE', id)

    if (res.status == 200) {
      toast.success('Cliente excluído com sucesso')
      setModal({
        open: false,
        info: "",
        title: "",
        action: () => { },
      });
      loadClients()
    } else {
      toast.error('Erro ao excluir cliente')
    }
  };

  const loadClients = async () => {
    const res = await useServices('clients', 'GET')

    if (res) {
      setClients(res.map(client => {
        return { ...client, street: `${client.address.street}, ${client.address.number}` }
      }));
    }

  };

  useEffect(() => {
    loadClients();
  }, []);

  const actions = {
    onEdit: (row) => {
      setFormModal({
        open: true,
        info: row.id,
        title: "Editar Cliente",
        action: () => loadClients()
      })
    },
    onDelete: (row) => {
      setModal({
        open: true,
        info: row.name,
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
      field: "cpfCnpj",
      headerName: "CPF/CNPJ",
      width: `200px`,
    },
    {
      field: "phone",
      headerName: "Telefone",
      width: `200px`,
    },
    {
      field: "street",
      headerName: "Endereço",
      width: `200px`,
    },
  ];

  return (
    <S.Wrapper>
      <PageHeader title='Clientes' subtitle='lista' />
      <Button
        floatRight={true}
        onButtonClick={() => {
          setFormModal({
            open: true,
            info: null,
            title: "Adicionar Cliente",
            action: () => loadClients()
          })
        }
        }
      >
        + Cliente
      </Button>
      <Modal modal={modal} setModal={setModal} />
      <FormModal modal={formModal} setModal={setFormModal} Form={ClientsForm} />
      <Table rows={clients} columns={columns} actions={actions} search={true} />
    </S.Wrapper>
  );
};

export default Clients;
