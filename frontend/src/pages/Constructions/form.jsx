import React, { useState } from "react";
import * as S from "./styles";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import Select from "../../components/Select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import Joi from "joi";
import Card from "../../components/Card";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useServices } from "../../hooks/useServices";

const ConstructionForm = ({ id, executeAction }) => {
  const { paramId } = useParams();
  const constructionId = id || paramId;
  let navigate = useNavigate();

  const fieldsValidations = {
    name: Joi.string().required().messages({
      "string.empty": `Este campo é obrigatório`,
    }),
  };

  const [address, setAddress] = useState({
    cep: "",
    state: "",
    city: "",
    street: "",
    district: "",
    number: "",
  });

  const { values, setValues, formValidate, errors } = useForm(
    {
      client_id: "",
      name: "",
      address: address,
      incoming_margin: 17,
      teams: 1
    },
    fieldsValidations
  );

  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (constructionId) {
      const fetchData = async () => {
        let constructionData = await useServices('constructions', 'GET', constructionId);
        setAddress(constructionData.address);

        setValues({
          client_id: constructionData.clientId,
          name: constructionData.name,
          address: address,
          incoming_margin: constructionData.incomingMargin,
          teams: constructionData.teams
        });
        setSelected(constructionData.clientId);
      }

      fetchData();
    }
  }, []);

  const handleChange = (prop, val) => {
    if (prop.indexOf('address') > -1) {
      const innerKey = prop.split('.')[1];
      setAddress({ ...address, [innerKey]: val });
      setValues({ ...values, address: address });
      return;
    }

    setValues({ ...values, [prop]: val });
  };

  const onSubmit = async () => {
    if (formValidate()) {
      toast.error("Confira os dados");
      return;
    }

    let res;

    if (constructionId) {
      res = await useServices('constructions', 'PUT', constructionId, {
        client_id: values.client_id,
        name: values.name,
        incoming_margin: values.incoming_margin,
        teams: values.teams,
        address: address,
      });
    } else {
      res = await useServices('constructions', 'POST', null, values);
    }

    if (res.status == 200) {
      toast.success(`Obra ${constructionId ? "editada" : "criada"} com sucesso`);
      navigate("/constructions");
    } else {
      toast.error("Erro na criação");
    }

    executeAction();
  };

  const title = constructionId ? "Alterar obra" : "Adicionar obra";

  return (
    <S.Wrapper>
      <Card title={title}>
        <S.Divisor>
          <div>
            <Select
              elsize="small"
              onInputChange={(val) => handleChange("client_id", val)}
              label="cliente"
              value={values.client_id}
              error={errors.client_id && errors.client_id}
              service='clients'
              selected={selected}
            />
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange("name", val)}
              label="nome"
              value={values.name}
              error={errors.name && errors.name}
            />
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange("incoming_margin", val)}
              label="taxa de administração (%)"
              value={values.incoming_margin}
              error={errors.incoming_margin && errors.incoming_margin}
              sufix='%'
            />
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange("teams", val)}
              label="equipes"
              value={values.teams}
              error={errors.teams && errors.teams}
            />
          </div>
          <div>
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange("address.cep", val)}
              label="cep"
              value={address.cep}
              error={errors.cep && errors.cep}
            />
            <S.Divisor>
              <TextField
                elsize="small"
                onInputChange={(val) => handleChange("address.state", val)}
                label="estado"
                value={address.state}
                error={errors.state && errors.state}
              />
              <TextField
                elsize="small"
                onInputChange={(val) => handleChange("address.city", val)}
                label="cidade"
                value={address.city}
                error={errors.city && errors.city}
              />
            </S.Divisor>
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange("address.street", val)}
              label="rua"
              value={address.street}
              error={errors.street && errors.street}
            />
            <S.Divisor>
              <TextField
                elsize="small"
                onInputChange={(val) => handleChange("address.district", val)}
                label="bairro"
                value={address.district}
                error={errors.district && errors.district}
              />
              <TextField
                elsize="small"
                onInputChange={(val) => handleChange("address.number", val)}
                label="número"
                value={address.number}
                error={errors.number && errors.number}
              />
            </S.Divisor>
          </div>
        </S.Divisor>
        <Button disabled={(
          address.cep == "" ||
          address.city == "" ||
          address.district == "" ||
          address.number == "" ||
          address.state == "" ||
          address.street == ""
        )} onButtonClick={onSubmit}>Salvar</Button>
      </Card>
    </S.Wrapper>
  );
};

export default ConstructionForm;
