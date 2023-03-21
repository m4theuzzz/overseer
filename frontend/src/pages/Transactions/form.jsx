import React, { useState } from "react";
import * as S from "./styles";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useServices } from "../../hooks/useServices";
import { useForm } from "../../hooks/useForm";
import Joi from "joi";
import Select from "../../components/Select";
import Card from "../../components/Card";
import { useParams } from "react-router";
import { useEffect } from "react";
import UploadImage from '../../images/uploadImage.png';

const TransactionsForm = ({ id, executeAction, partialData }) => {
  const { paramId } = useParams();
  const transactionId = id || paramId;
  let navigate = useNavigate();

  const fieldsValidations = {
    name: Joi.string().required().messages({
      "string.empty": `Este campo é obrigatório`,
    }),
    value: Joi.number().required().messages({
      "number.empty": `Este campo é obrigatório`,
    }),
  };

  const { values, setValues, formValidate, errors } = useForm(
    {
      name: "",
      description: partialData?.serviceName ?? "",
      file: UploadImage,
      value: partialData?.cost?.replace('R$ ', '') ?? "",
      budget_id: partialData?.budgetId ?? "",
      service_id: partialData?.serviceId ?? "",
      type: "",
      scheduling: "",
    },
    fieldsValidations
  );

  useEffect(() => {
    if (transactionId && !partialData) {
      const fetchData = async () => {
        await useServices('transactions', 'GET', transactionId).then(transactionData => {
          setTimeout(() => {
            setValues({
              name: transactionData.name,
              description: transactionData.description,
              file: transactionData.file,
              value: transactionData.value,
              budget_id: transactionData.budgetId,
              service_id: transactionData.serviceId,
              type: transactionData.type,
              scheduling: transactionData.scheduling ? transactionData.scheduling.replace('T', ' ').replace('.000Z', '') : null,
            })
          }, 100);
        });
      }

      fetchData();
    }
  }, [transactionId]);

  const handleChange = (prop, val) => {
    setValues({ ...values, [prop]: val });
  };

  const onSubmit = async () => {
    if (formValidate()) {
      toast.error("Confira os seus dados");
      return;
    }

    let res;

    if (transactionId && !partialData) {
      res = await useServices('transactions', 'PUT', transactionId, {
        name: values.name,
        value: values.value,
        description: values.description,
        budget_id: values.budget_id,
        service_id: partialData?.serviceId,
        type: values.type,
        file: values.file,
        scheduling: values.scheduling,
      });
    } else {
      res = await useServices('transactions', 'POST', null, values);
    }

    if (res.status == 200) {
      toast.success(`Transação ${transactionId ? "editada" : "criada"} com sucesso`);
      !partialData && navigate("/transactions");
    } else {
      toast.error("Erro na criação");
    }

    executeAction();
  };

  const readInput = (input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = (e) => {
        handleChange("file", e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  const handleUpload = (event) => {
    readInput(event.target);
  }

  const title = transactionId && !partialData ? "Alterar Transação" : "Adicionar Transação";

  return (
    <S.Wrapper>
      <Card title={title}>
        <Select
          elsize="small"
          onInputChange={(val) => handleChange("budget_id", val)}
          label="orçamento"
          value={values.budget_id}
          error={errors.budget_id && errors.budget_id}
          service='budgets'
          selected={partialData?.budgetId || values.budget_id}
        />
        <S.TwoColumns>
          <TextField
            elsize="small"
            className="test"
            onInputChange={(val) => handleChange("name", val)}
            label="nome"
            value={values.name}
            error={errors.name && errors.name}
          />
          <TextField
            elsize="small"
            onInputChange={(val) => handleChange("value", val)}
            label="valor"
            value={values.value}
            error={errors.value && errors.value}
          />
        </S.TwoColumns>

        <Select
          elsize="small"
          onInputChange={(val) => handleChange("type", val)}
          label="tipo"
          value={values.type}
          error={errors.type && errors.type}
          options={[
            { id: "incoming", name: "entrada" },
            { id: "outcoming", name: "saída" },
          ]}
        />

        <TextField
          elsize="small"
          onInputChange={(val) => handleChange("scheduling", val)}
          label="agendamento"
          value={values.scheduling}
          error={errors.scheduling && errors.scheduling}
          placeholder="yyyy-MM-dd HH:mm:ss"
        />
        <TextField
          elsize="small"
          onInputChange={(val) => handleChange("description", val)}
          label="descrição"
          value={values.description}
          error={errors.description && errors.description}
        />

        <div style={{ width: "auto", height: "140px" }}>
          <label htmlFor="NFe" style={{ width: "auto", height: "100%" }}>
            <S.NF src={values.file} name="NFe" />
            <input
              style={{ display: 'none' }}
              onChange={handleUpload}
              name="NFe"
              id="NFe"
              type="file"
              label="file"
              accept=".png, .jpg, .jpeg, .pdf, .webp"
            />
          </label>
        </div>


        <Button onButtonClick={onSubmit}>Salvar</Button>

      </Card>
    </S.Wrapper>
  );
};

export default TransactionsForm;
