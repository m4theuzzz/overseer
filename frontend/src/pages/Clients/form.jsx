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
import { cnpjMask, cpfMask } from "../../utils/masks";
import { useServices } from "../../hooks/useServices"

const ClientsForm = ({ id, executeAction }) => {
  const { paramId } = useParams();
  const clientId = id || paramId;

  let navigate = useNavigate();

  const fieldsValidations = {
    name: Joi.string().required().messages({
      "string.empty": `Este campo é obrigatório`,
    }),
    cpf_cnpj: Joi.string().required().messages({
      "string.empty": `Este campo é obrigatório`,
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": `Este campo é obrigatório`,
        "string.email": `Email inválido`,
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
      name: "",
      cpf_cnpj: "",
      email: "",
      phone: "",
      address: address
    },
    fieldsValidations
  );

  useEffect(() => {
    if (clientId) {
      const fetchData = async () => {
        let clientData = await useServices('clients', 'GET', clientId);
        setAddress(clientData.address);
        delete clientData.address;

        setValues({
          ...clientData,
          cpf_cnpj: clientData.cpfCnpj
        });
      };

      fetchData();
    }
  }, []);

  const handleChange = (prop, val) => {

    if (prop == 'cpf_cnpj') {
      const maskedVal = val.length > 14 ? cnpjMask(val) : cpfMask(val)
      console.log(val);
      // const maskedVal = cnpjMask(val)
      setValues({ ...values, 'cpf_cnpj': maskedVal });
      return
    }

    if (prop.indexOf('address') > -1) {
      const innerKey = prop.split('.')[1];
      setAddress({ ...address, [innerKey]: val });
      setValues({ ...values, 'address': address });
      return;
    }

    setValues({ ...values, [prop]: val });
  };

  const onSubmit = async () => {
    if (formValidate()) {
      toast.error("Confira os seus dados");
      return;
    }

    let res;

    if (clientId) {
      res = await useServices('clients', 'PUT', clientId, {
        name: values.name,
        email: values.email,
        cpf_cnpj: values.cpf_cnpj,
        phone: values.phone,
        address: address
      });
    } else {
      res = await useServices('clients', 'POST', null, values);
    }

    if (res.status == 200) {
      toast.success(`Cliente ${clientId ? "editado" : "criado"} com sucesso`);
      navigate("/clients");
    } else {
      toast.error("Erro na criação");
    }

    executeAction();
  };

  const title = clientId ? "Alterar Cliente" : "Adicionar Cliente";

  return (
    <S.Wrapper>
      <Card title={title}>
        <S.Divisor>
          <div>
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange("name", val)}
              label="nome"
              value={values.name}
              error={errors.name && errors.name}
            />
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange("cpf_cnpj", val)}
              label="cpf ou cnpj"
              value={values.cpf_cnpj}
              error={errors.cpf_cnpj && errors.cpf_cnpj}
            />
            <TextField
              elsize="small"
              type="email"
              onInputChange={(val) => handleChange("email", val)}
              label="email"
              value={values.email}
              error={errors.email && errors.email}
            />
            <TextField
              elsize="small"
              type="phone"
              onInputChange={(val) => handleChange("phone", val)}
              label="telefone"
              value={values.phone}
              error={errors.phone && errors.phone}
            />
          </div>
          <div>
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange("address.cep", val)}
              label="cep"
              value={address.cep}
              error={errors.address && errors.address}
            />
            <S.Divisor>
              <TextField
                elsize="small"
                onInputChange={(val) => handleChange("address.state", val)}
                label="estado"
                value={address.state}
                error={errors.address && errors.address}
              />
              <TextField
                elsize="small"
                onInputChange={(val) => handleChange("address.city", val)}
                label="cidade"
                value={address.city}
                error={errors.address && errors.address}
              />
            </S.Divisor>
            <TextField
              elsize="small"
              onInputChange={(val) => handleChange("address.street", val)}
              label="rua"
              value={address.street}
              error={errors.address && errors.address}
            />
            <S.Divisor>
              <TextField
                elsize="small"
                onInputChange={(val) => handleChange("address.district", val)}
                label="bairro"
                value={address.district}
                error={errors.address && errors.address}
              />
              <TextField
                elsize="small"
                onInputChange={(val) => handleChange("address.number", val)}
                label="número"
                value={address.number}
                error={errors.address && errors.address}
              />
            </S.Divisor>
          </div>
        </S.Divisor>
        <Button onButtonClick={onSubmit}>Salvar</Button>
      </Card>
    </S.Wrapper>
  );
};

export default ClientsForm;
