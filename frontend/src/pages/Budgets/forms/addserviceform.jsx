import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "../../../components/Card";
import AsyncDropdownSingle from "../../../components/Dropdown/AsyncDropdownSingle";
import TextField from "../../../components/TextField";
import { useForm } from "../../../hooks/useForm";
import { useServices } from "../../../hooks/useServices";
import * as S from "../styles";
import Table from "../../../components/Table"

const AddServiceForm = ({ id, executeAction }) => {
  const { paramId } = useParams();

  const fieldsValidations = {};
  const handleChange = (prop, val) => {
    setValues({ ...values, [prop]: val });
  };

  const [selectedServices, setSelecetedServices] = useState([]);
  const [currentService, setCurrentService] = useState({ id: null, service_id: null, sector: '', quantity: 0 });

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: `30px`,
    },
    {
      field: "name",
      headerName: "Name",
      width: `200px`,
    },
    {
      field: "quantity",
      headerName: "Quantidade",
      width: `50px`,
    }
  ];

  const handleRemoveFromAddList = (id) => {
    setSelecetedServices(selectedServices.filter(service => service.id !== id));
  }

  const actions = {
    onDelete: (row) => handleRemoveFromAddList(row.id)
  }

  const handleAddService = async () => {
    try {
      selectedServices.forEach(async (service) => {
        const budgetService = {
          service_id: service.id,
          sector: service.sector,
          quantity: service.quantity
        }
        await useServices('budgetServices', 'POST', null, budgetService, paramId);
      });

      toast.success(`Serviços adicionados com sucesso`);
      executeAction();
    } catch (error) {
      console.log(error);
      toast.error(`Erro ao adicionar serviços`);
    }
  }

  const { values, setValues, formValidate, errors } = useForm(
    {
      service_id: "",
      quantity: "",
      sector: "",
    },
    fieldsValidations
  );

  const addService = (service) => {
    if (!selectedServices.find((x) => x.id === service.id)) {
      setSelecetedServices((prev) => [...prev, service]);
    }
  };

  return (
    <Card title={"Adicionar serviços"}>
      <AsyncDropdownSingle
        label="Serviço"
        service="services"
        onDropdownChange={(el) => setCurrentService(prev => ({ ...prev, id: el.id, name: el.name, sector: '' }))}
      />
      <S.Divisor>
        <TextField value={currentService.sector} onInputChange={(val) => {
          setCurrentService(prev => ({ ...prev, sector: val }))
          handleChange('sector', val);
        }} label="setor" />
        <TextField value={currentService.quantity} type="number" onInputChange={(val) => {
          setCurrentService(prev => ({ ...prev, quantity: val }))
          handleChange('quantity', val);
        }} label="quantidade" />
      </S.Divisor>
      <Button
        onButtonClick={() => {
          addService(currentService);
        }}
      >
        + Serviço
      </Button>
      <Table
        rows={selectedServices}
        columns={columns}
        actions={actions}
      />
      <Button onButtonClick={() => handleAddService()}>Salvar</Button>
    </Card>
  );
};

export default AddServiceForm;
