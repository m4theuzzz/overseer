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
import UsersForm from "./form";
import { useServices } from "../../hooks/useServices";
import Table from "../../components/Table";
import PageHeader from "../../components/PageHeader";

const Users = () => {
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

  const [users, setUsers] = useState([]);

  const handleDelete = async (id) => {
    const res = await useServices('users', 'DELETE', id);

    if (res.status == 200) {
      toast.success('Usuário excluído com sucesso')
      setModal({
        open: false,
        info: "",
        title: "",
        action: () => { },
      });
      loadUsers();
    } else {
      toast.error('Erro ao excluir usuário')
    }
  };

  const loadUsers = async () => {
    const res = await useServices('users', 'GET');

    if (res) {
      setUsers(res);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const actions = {
    onEdit: (row) => {
      setFormModal({
        open: true,
        info: row.id,
        title: "Editar Usuário",
        action: () => loadUsers()
      })
    },
    onDelete: (row) => {
      setModal({
        open: true,
        info: row.name,
        title: "Excluir Usuário",
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
      field: "email",
      headerName: "Email",
      width: `150px`,
    },
    {
      field: "phone",
      headerName: "Telefone",
      width: `150px`,
    },
    {
      field: "level",
      headerName: "Nível de permissão",
      width: `150px`,
    },
  ];

  return (
    <S.Wrapper>
      <PageHeader title='Usuários' subtitle='lista' />
      <Button
        floatRight={true}
        onButtonClick={() => {
          setFormModal({
            open: true,
            info: null,
            title: "Adicionar Usuário",
            action: () => loadUsers()
          })
        }
        }
      >+ Usuário</Button>
      <FormModal modal={formModal} setModal={setFormModal} Form={UsersForm} />
      <Modal modal={modal} setModal={setModal} />
      <Table rows={users} columns={columns} actions={actions} search={true} />
    </S.Wrapper>
  );
};

export default Users;
