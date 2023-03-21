import React from "react";
import * as S from "../styles";
import Button from "../../../components/Button";
import toast from "react-hot-toast";
import { useForm } from "../../../hooks/useForm";
import Card from "../../../components/Card";
import { useServices } from "../../../hooks/useServices";
import Select from '../../../components/Select';
import TextField from "../../../components/TextField";

const BudgetsForm = ({ id, executeAction }) => {
  const fieldsValidations = {};

  const { values, setValues, formValidate, errors } = useForm(
    {
      name: "",
      construction_id: "",
      client_id: ""
    },
    fieldsValidations
  );


  const handleChange = async (prop, val) => {
    setValues({ ...values, [prop]: val });
  };

  const onSubmit = async () => {
    let res;

    res = await useServices('budgets', 'POST', null, values);

    if (res.status == 200) {
      toast.success(`Orçamento criado com sucesso`);
      executeAction();
    } else {
      toast.error("Erro na criação");
    }
  };

  return (
    <S.Wrapper>
      <Card title={"Novo orçamento"}>
        <TextField
          elsize="small"
          onInputChange={(val) => handleChange("name", val)}
          label="Nome do Orçamento"
          value={values.name}
          error={errors.address && errors.address}
        />
        <Select label="Obra" service="constructions" onInputChange={(el) => handleChange('construction_id', el)} />
        <Select label="Cliente" service="clients" onInputChange={(el) => handleChange('client_id', el)} />
        <Button onButtonClick={onSubmit}>Salvar</Button>
      </Card>
    </S.Wrapper >
  );
};

export default BudgetsForm;
