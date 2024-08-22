import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useHistory } from 'react-router-dom'

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import {Button, ErrorMessage} from '../../components';
import LoginImg from "../../assets/login-image.svg";
import Logo from "../../assets/logo.svg";
import { useUser} from '../../hooks/UserContext'
import api from "../../services/api";

import {
  Container,
  LoginImage,
  ContainerItens,
  Label,
  Input,
  EntrarLink
} from "./styles";

export function Login() {
  const history = useHistory()
  const { putUserData} = useUser()
 

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Digite um e-mail válido")
      .required("O e-mail é obrigatório"),    
    password: Yup.string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve ter no mínimo 6 dígitos"),
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
      const {data} = await toast.promise(
        api.post("session", {
          email: clientData.email,
          password: clientData.password,
        }),
        {
          pending: 'Verificando seus dados...',
          success: 'Seja bem-vindo(a)!',
          error: 'Erro ao verificar e-mail e senha. Tente novamente.',
        }
      )
      putUserData(data)


      setTimeout(() => {
        if (data.admin) {
          history.push('/pedidos')
        } else {
          history.push('/')
        }
      }, 1000);

      
     
    } catch (error) {
     
    }
  };

  return (
    <Container>
      <LoginImage src={LoginImg} alt="Imagem de login" />
      <ContainerItens>
        <img src={Logo} alt="Logo da empresa" />
        <h1>Login</h1>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby="email-error"
          />
          {errors.email && <ErrorMessage id="email-error">{errors.email.message}</ErrorMessage>}

          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby="password-error"
          />
          {errors.password && <ErrorMessage id="password-error">{errors.password.message}</ErrorMessage>}

          <Button type="submit" style={{ marginTop: 75, marginBottom: 25 }}>Entrar</Button>
        </form>
        <EntrarLink>
          Não possui conta? <Link style={{ color: 'white'}} to='/cadastro'>Cadastre-se</Link>
        </EntrarLink>
      </ContainerItens>
    </Container>
  );
}

