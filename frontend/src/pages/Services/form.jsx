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
import Select from '../../components/Select';

const ServicesForm = ({ id, executeAction }) => {
  const { paramId } = useParams();
  const serviceId = id || paramId;

  const [serverValues, setServerValues] = useState()
  let navigate = useNavigate();

  const fieldsValidations = {
    name: Joi.string().required().messages({
      "string.empty": `Este campo é obrigatório`,
    }),
    mesure_unit: Joi.string().required().messages({
      "string.empty": `Este campo é obrigatório`,
    }),
    error_margin: Joi.number().required().messages({
      "number.empty": `Este campo é obrigatório`,
    }),
    coefficient: Joi.number().required().messages({
      "number.empty": `Este campo é obrigatório`,
    }),
    multiplier: Joi.string().required().messages({
      "string.empty": `Este campo é obrigatório`,
    }),
  };

  const { values, setValues, formValidate, errors } = useForm(
    {
      name: "",
      description: "",
      mesure_unit: "",
      error_margin: "",
      coefficient: "",
      multiplier: "",
      employee_role: "",
      unity_cost: "",
    },
    fieldsValidations
  );


  useEffect(() => {
    if (serviceId) {
      const fetchData = async () => {
        const serviceData = await useServices('services', 'GET', serviceId);
        setValues({
          name: serviceData.name,
          description: serviceData.description,
          mesure_unit: serviceData.mesureUnit,
          error_margin: serviceData.errorMargin,
          coefficient: serviceData.coefficient,
          multiplier: serviceData.multiplier,
          employee_role: serviceData.employeeRole,
          unity_cost: serviceData.unityCost
        })
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

    if (serviceId) {
      res = await useServices('services', 'PUT', serviceId, {
        name: values.name,
        description: values.description,
        mesure_unit: values.mesure_unit,
        error_margin: values.error_margin,
        coefficient: values.coefficient,
        multiplier: values.multiplier,
        employee_role: values.employee_role,
        unity_cost: values.unity_cost,
      });
    } else {
      res = await useServices('services', 'POST', null, values);
    }

    if (res.status == 200) {
      toast.success(`Serviço ${serviceId ? "editado" : "criado"} com sucesso`);
      navigate("/services");
    } else {
      toast.error("Erro na criação");
    }

    executeAction();
  }

  const title = serviceId ? "Alterar Serviço" : "Adicionar Serviço";

  return (
    <S.Wrapper>
      <Card title={title}>

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
          onInputChange={(val) => handleChange("description", val)}
          label="descrição"
          value={values.description}
          error={errors.description && errors.description}
        />
        <S.TwoColumns>
          <Select
            elsize="small"
            onInputChange={(val) => handleChange("mesure_unit", val)}
            label="unidade de medida"
            value={values.mesure_unit}
            error={errors.mesure_unit && errors.mesure_unit}
            options={[{ id: "m", name: "metros" }, { id: "m2", name: "metros quadrados" }, { id: "m3", name: "metros cúbicos" }, { id: "unit", name: "unidade" }, { id: "day", name: "dias" },]}
            selected={values.mesure_unit}
          />
          <TextField
            elsize="small"
            onInputChange={(val) => handleChange("error_margin", val)}
            label="margem de erro"
            value={values.error_margin}
            error={errors.error_margin && errors.error_margin}
          />
        </S.TwoColumns>

        <S.TwoColumns>
          <TextField
            elsize="small"
            onInputChange={(val) => handleChange("coefficient", val)}
            label="coeficiente"
            value={values.coefficient}
            error={errors.coefficient && errors.coefficient}
          />
          <TextField
            elsize="small"
            onInputChange={(val) => handleChange("multiplier", val)}
            label="multiplicador"
            value={values.multiplier}
            error={errors.multiplier && errors.multiplier}
          />
        </S.TwoColumns>

        <S.TwoColumns>

          <TextField
            elsize="small"
            onInputChange={(val) => handleChange("employee_role", val)}
            label="cargo do funcionario"
            value={values.employee_role}
            error={errors.employee_role && errors.employee_role}
          />

          <TextField
            elsize="small"
            onInputChange={(val) => handleChange("unity_cost", val)}
            label="custo por unidade"
            value={values.unity_cost}
            error={errors.unity_cost && errors.unity_cost}
          />
        </S.TwoColumns>
        <Button onButtonClick={onSubmit}>Salvar</Button>
      </Card>
    </S.Wrapper>
  );
};

export default ServicesForm;
