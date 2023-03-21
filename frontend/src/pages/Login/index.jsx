import React from "react";
import * as S from "./styles";
import Logo from "../../images/logo.png";
import BottomLogo from "../../images/bottomlogo.png";
import TextField from "../../components/TextField";
import Button from "../../components/Button";
import toast from "react-hot-toast";
import { userLogin } from "./services";
import { useForm } from "../../hooks/useForm";
import Joi from "joi";
import Circles from '../../images/circles.png'

const Login = () => {

  const fieldsValidations = {
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      'string.empty': `Este campo é obrigatório`
    }),
    password: Joi.string().required().messages({
      'string.empty': `Este campo é obrigatório`
    })
  }

  const { values, setValues, formValidate, errors } = useForm({
    email: "",
    password: ""
  }, fieldsValidations);

  const handleChange = (prop, val) => {
    setValues({ ...values, [prop]: val });
  };

  const onSubmit = async () => {
    if (formValidate()) {
      toast.error('Confira os seus dados')
      return
    }

    const res = await userLogin({ email: values.email, password: values.password });

    if (res.status == 200) {
      toast.success('Login bem sucedido');
      const json = await res.json();
      let user = json["user"];
      window.sessionStorage.setItem('profileImage', user.profilePicture);
      delete user["profilePicture"];

      window.localStorage.setItem("api-token", json["session-token"]);
      window.localStorage.setItem("userInfo", JSON.stringify(user));

      window.location.href = window.location.href.split('/')[0] + (user.permissionLevel == 7 ? "/dashboard" : "/transactions/new");
    } else {
      toast.error(res.statusText);
    }
  };

  return (
    <S.Wrapper>
      <S.AsideBox>
        <S.CirclesImg src={Circles} />
        <img src={Logo}></img>

        <S.FormBox>
          <S.FieldsBox>
            <S.WelcomeBox>
              <p>
                <strong>Bem vindo de volta.</strong>
              </p>
              <p>Insira suas informações de login</p>
            </S.WelcomeBox>
            <TextField
              onInputChange={(val) => handleChange("email", val)}
              type="email"
              label="email"
              error={errors.email && errors.email}
            />
            <TextField
              onInputChange={(val) => handleChange("password", val)}
              type="password"
              label="senha"
              error={errors.password && errors.password}
            />
            <Button onButtonClick={onSubmit}>Entrar</Button>
          </S.FieldsBox>
        </S.FormBox>
        <S.BottomImg src={BottomLogo}></S.BottomImg>
      </S.AsideBox>
    </S.Wrapper>
  );
};

export default Login;
