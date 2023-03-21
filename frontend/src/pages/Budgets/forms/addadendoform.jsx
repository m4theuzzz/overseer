import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "../../../components/Card";
import AsyncDropdownSingle from "../../../components/Dropdown/AsyncDropdownSingle";
import BasicDropdownSingle from "../../../components/Dropdown/BasicDropdownSingle";
import TextField from "../../../components/TextField";
import { useForm } from "../../../hooks/useForm";
import { useServices } from "../../../hooks/useServices";
import * as S from "../styles";
import Table from "../../../components/Table";
import Radio from "../../../components/Radio";

const AddAdendoForm = ({ id, executeAction }) => {
  const { paramId } = useParams();

  const fieldsValidations = {};
  const handleChange = (prop, val) => {
    setValues({ ...values, [prop]: val });
  };

  const [option, setOption] = useState("edit");

  const [currentService, setCurrentService] = useState({
    id: null,
    service_id: null,
    sector: "",
    quantity: 0,
  });
  const [newService, setNewService] = useState({
    service_id: null,
    sector: "",
    quantity: 0,
  });

  const handleSaveChange = async () => {
    try {
      const budgetService = {
        service_id: currentService.service_id,
        sector: currentService.sector,
        quantity: values.quantity,
        status: "overwritten",
      };

      const newBudgetService = {
        service_id: newService.service_id,
        sector: newService.sector,
        quantity: values.quantity,
        type: "added"
      };

      if (option == "edit") {
        await useServices(
          "budgetServices",
          "PUT",
          currentService.id,
          budgetService,
          paramId
        );

        await useServices("budgetServices", "POST", null, newBudgetService, paramId);
      }

      if (option == "add") {
        await useServices("budgetServices", "POST", null, newBudgetService, paramId);
      }

      toast.success(`Alteração realizada com sucesso`);
      executeAction();
    } catch (error) {
      console.log(error);
      toast.error(`Erro ao adicionar serviços`);
    }
  };

  const { values, setValues, formValidate, errors } = useForm(
    {
      service_id: "",
      quantity: "",
      sector: "",
    },
    fieldsValidations
  );

  return (
    <Card title={"Adicionar adendo"}>
      <br />
      <S.Divisor>
        <Radio
          label="Substituir"
          onCheck={() => setOption("edit")}
          labelFor="check"
          value="anyValue"
          checked={option == "edit"}
        />
        <Radio
          label="Adicionar"
          onCheck={() => setOption("add")}
          labelFor="check"
          value="wd"
          checked={option == "add"}
        />
      </S.Divisor>
      <br />
      {option == "edit" && (
        <BasicDropdownSingle
          label="Serviço a ser substituído"
          data={id.services.filter(service => service.status == "ok")}
          mainkey={"serviceName"}
          onDropdownChange={(el) => {
            setCurrentService((prev) => ({
              ...prev,
              id: el.id,
              service_id: el.serviceId,
              name: el.name,
              sector: el.sector,
            }));
          }}
        />
      )}

      <AsyncDropdownSingle
        label="Novo serviço"
        service="services"
        onDropdownChange={(el) => {
          console.log(el)
          return setNewService((prev) => ({
            ...prev,
            service_id: el.id,
            name: el.name
          }))
        }}
      />

      <TextField
        value={newService.sector}
        type="text"
        onInputChange={(val) => {
          setNewService((prev) => ({
            ...prev,
            sector: val
          }));
          handleChange("sector", val);
        }}
        label="Setor"
      />

      <TextField
        value={newService.quantity}
        type="number"
        onInputChange={(val) => {
          setNewService((prev) => ({
            ...prev,
            quantity: val
          }));
          handleChange("quantity", val);
        }}
        label="Quantidade"
      />

      <Button onButtonClick={() => handleSaveChange()}>Salvar</Button>
    </Card>
  );
};

export default AddAdendoForm;
