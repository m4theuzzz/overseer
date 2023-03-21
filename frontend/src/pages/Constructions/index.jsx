import React, { useState } from "react";
import * as S from "./styles";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import Modal from "../../components/Modal";
import ConstructionForm from "./form";
import FormModal from "../../components/FormModal";
import { useServices } from "../../hooks/useServices";
import Table from "../../components/Table";
import PageHeader from "../../components/PageHeader";

const Constructions = () => {
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

  const [constructions, setConstructions] = useState([]);

  const handleDelete = async (id) => {
    const res = await useServices('constructions', 'DELETE', id);
    if (res.status == 200) {
      toast.success('Obra excluída com sucesso')
      setModal({
        open: false,
        info: "",
        title: "",
        action: () => { },
      });
      loadConstructions();
    } else {
      toast.error('Erro ao excluir obra')
    }
  };

  const loadConstructions = async () => {
    const constructions = await useServices('constructions', 'GET');
    const clients = await useServices('clients', 'GET');

    const res = constructions.map(construct => {
      const client = clients.find(client => client.id == construct.clientId);
      return {
        ...construct,
        client: client.name,
        street: `${client.address.street}, ${client.address.number}`
      }
    });

    if (res) {
      setConstructions(res);
    }
  };

  useEffect(() => {
    loadConstructions();
  }, []);

  const actions = {
    onEdit: (row) => {
      setFormModal({
        open: true,
        info: row.id,
        title: "Editar Obra",
        action: () => loadConstructions()
      })
    },
    onDelete: (row) => {
      setModal({
        open: true,
        title: "Excluir Obra",
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
      headerName: "Nome da obra",
      width: `200px`,
    },
    {
      field: "client",
      headerName: "Cliente",
      width: `200px`,
    },
    {
      field: "street",
      headerName: "Endereço",
      width: `200px`,
    }
  ];

  return (
    <S.Wrapper>
      <PageHeader title='Obras' subtitle='lista' />
      <Button
        floatRight={true}
        onButtonClick={() => {
          setFormModal({
            open: true,
            info: null,
            title: "Adicionar Obra",
            action: () => loadConstructions()
          })
        }
        }
      >+ Obra</Button>
      <FormModal modal={formModal} setModal={setFormModal} Form={ConstructionForm} />
      <Modal modal={modal} setModal={setModal} />
      <Table
        rows={constructions}
        columns={columns}
        actions={actions}
        search={true}
      />
    </S.Wrapper>
  );
};

export default Constructions;