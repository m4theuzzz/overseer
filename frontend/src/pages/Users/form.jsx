import React, { useState } from "react";
import * as S from "./styles";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import Joi from "joi";
import Card from "../../components/Card";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useServices } from "../../hooks/useServices";
import Select from "../../components/Select";

const UsersForm = ({ id, executeAction }) => {
  const { paramId } = useParams();
  const userId = id || paramId;

  let navigate = useNavigate();

  const fieldsValidations = {
    name: Joi.string().required().messages({
      "string.empty": `Este campo é obrigatório`,
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": `Este campo é obrigatório`,
        "string.email": `Email inválido`,
      }),
    phone: Joi.number().required().messages({
      "number.empty": `Este campo é obrigatório`,
    }),
  };

  if (!userId) {
    fieldsValidations.password = Joi.string().required().messages({
      "string.empty": `Este campo é obrigatório`,
    })
  }

  const { values, setValues, formValidate, errors } = useForm(
    {
      name: "",
      email: "",
      password: "",
      phone: null,
      level: 7
    },
    fieldsValidations
  );

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const userData = await useServices('users', 'GET', userId);
        setValues(userData)
      }

      fetchData();
    }
  }, []);

  const handleChange = (prop, val) => {
    setValues({ ...values, [prop]: val });
  };

  const onSubmit = async () => {
    if (formValidate()) {
      toast.error("Confira os seus dados");
      return;
    }

    let res;

    if (userId) {
      res = await useServices('users', 'PUT', userId, {
        name: values.name,
        email: values.email,
        phone: values.phone
      });
    } else {
      res = await useServices('users', 'POST', null, values);
    }

    if (res.status == 200) {
      toast.success(`Usuário ${userId ? "editado" : "criado"} com sucesso`);
      navigate("/users");
    } else {
      toast.error("Erro na criação");
    }

    executeAction();
  };

  const title = userId ? "Alterar Usuário" : "Adicionar Usuário";

  return (
    <S.Wrapper>
      <Card title={title}>
        <TextField
          elsize="small"
          onInputChange={(val) => handleChange("name", val)}
          label="nome"
          value={values.name}
          error={errors.name && errors.name}
        />
        <TextField
          elsize="small"
          onInputChange={(val) => handleChange("phone", val)}
          label="telefone"
          value={values.phone}
          error={errors.phone && errors.phone}
        />
        <TextField
          elsize="small"
          type="email"
          onInputChange={(val) => handleChange("email", val)}
          label="email"
          value={values.email}
          error={errors.email && errors.email}
        />
        <Select
          elsize="small"
          onInputChange={(val) => handleChange("level", val)}
          label="tipo"
          value={values.level}
          error={errors.type && errors.type}
          options={[
            { id: 7, name: "Engenheiro" },
            { id: 1, name: "Assistente Administrativo" },
          ]}
        />
        {!userId &&
          <TextField
            elsize="small"
            type="password"
            onInputChange={(val) => handleChange("password", val)}
            label="senha"
            value={values.password}
            error={errors.password && errors.password}
          />
        }
        <Button onButtonClick={onSubmit}>Salvar</Button>
      </Card>
    </S.Wrapper>
  );
};

export default UsersForm;
