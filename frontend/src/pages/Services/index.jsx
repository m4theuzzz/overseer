import React, { useState } from "react";
import * as S from "./styles";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Modal from "../../components/Modal";
import { useServices } from "../../hooks/useServices";
import ServicesForm from "./form";
import FormModal from "../../components/FormModal";
import Table from "../../components/Table";
import PageHeader from "../../components/PageHeader";

const Services = () => {
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

  const [services, setServices] = useState([]);

  const handleDelete = async (id) => {
    const res = await useServices('services', 'DELETE', id);

    if (res.status == 200) {
      toast.success('Serviço excluído com sucesso')
      setModal({
        open: false,
        info: "",
        title: "",
        action: () => { },
      });
      loadServices();
    } else {
      toast.error('Erro ao excluir serviço')
    }
  };

  const loadServices = async () => {
    const res = await useServices('services', 'GET');

    if (res) {
      setServices(res);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const actions = {
    onEdit: (row) => {
      setFormModal({
        open: true,
        info: row.id,
        title: "Editar Serviço",
        action: () => loadServices()
      })
    },
    onDelete: (row) => {
      setModal({
        open: true,
        info: row.name,
        title: "Excluir Serviço",
        action: () => handleDelete(row.id),
      })
    },
  }

  const translateMesureUnit = (rawUnit) => {
    switch (rawUnit) {
      case "m2":
        return "m²";

      case "m3":
        return "m³";

      case "day":
        return "dia(s)";

      case "unit":
        return "unidade(s)";

      default:
        return rawUnit;
    }
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
      width: `24%`,
    },
    {
      field: "mesureUnit",
      headerName: "Unidade de medida",
      width: `12%`,
      renderCell: (param) => translateMesureUnit(param)
    },
    {
      field: "errorMargin",
      headerName: "Margem de erro",
      width: `12%`,
      renderCell: (param) => `${param * 100}%`
    },
    {
      field: "coefficient",
      headerName: "Coeficiente",
      width: `12%`,
    },
    {
      field: "multiplier",
      headerName: "Multiplicador",
      width: `12%`,
    },
  ];

  return (
    <S.Wrapper>
      <PageHeader title='Serviços' subtitle='lista' />
      <Button
        floatRight={true}
        onButtonClick={() => {
          setFormModal({
            open: true,
            info: null,
            title: "Adicionar Serviço",
            action: () => loadServices()
          })
        }
        }
      >+ Serviço</Button>
      <FormModal modal={formModal} setModal={setFormModal} Form={ServicesForm} />
      <Modal modal={modal} setModal={setModal} />
      <Table rows={services} columns={columns} actions={actions} search={true} />
    </S.Wrapper>
  );
};

export default Services;
