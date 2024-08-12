import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Link } from 'react-router-dom'
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from 'react-toastify'

import Button from '../../components/Button';
import RegisterImg from "../../assets/register-image.svg";
import Logo from "../../assets/logo.svg";
import api from "../../services/api";

import {
  Container,
  RegisterImage,
  ContainerItens,
  Label,
  Input,
  EntrarLink,
  ErrorMessage,
} from "./styles";

function Register() {
  const schema = Yup.object().shape({
    name: Yup.string().required('O seu nome é obrigatório'),
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O e-mail é obrigatório"),
    password: Yup.string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve ter o mínimo de 6 digitos"),
      confirmPassword: Yup.string().required('A senha é obrigatória').oneOf([Yup.ref('password')], 'As senhas devem ser iguais')
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (clientData) => {
    try {
      const { status } = await api.post(
        "users", 
        {
        name: clientData.name,
        email: clientData.email,
        password: clientData.password,
      }, {validateStatus: () => true}
    )

    if( status === 201 || status === 200 ) {
      toast.success('Cadastro realizado com sucesso');
    } else if( status === 409) {
      toast.error('E-mail já cadastrado! Faça login para continuar')
    } else {
      throw new Error()
    }
    } catch(err) {
      toast.error('Falha no sistema! Tente novamente')
    }

  };

  return (
    <Container>
      <RegisterImage src={RegisterImg} alt="register-image" />
      <ContainerItens>
        <img src={Logo} alt="logo-code-burger" />
        <h1>Cadastre-se</h1>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>

          <Label error={errors.name?.message}>Nome</Label>
          <Input
            type="text"
            {...register("name")}
            error={errors.name?.message}
          />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>

          <Label error={errors.email?.message}>Email</Label>
          <Input
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <ErrorMessage>{errors.email?.message}</ErrorMessage>

          <Label error={errors.password?.message}>Senha</Label>
          <Input
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
          <ErrorMessage>{errors.password?.message}</ErrorMessage>

          <Label error={errors.confirmPassword?.message}>Confirmar Senha</Label>
          <Input
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>

          <Button type="submit" style={{ marginTop: 25, marginBottom: 25}}>Cadastrar</Button>
        </form>
        <EntrarLink>
          Já possui conta? <Link style={{color: 'white'}} to='/login'>Entrar</Link>
        </EntrarLink>
      </ContainerItens>
    </Container>
  );
}

export default Register
