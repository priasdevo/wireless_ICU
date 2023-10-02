import React, { useState } from 'react'
import {
  Button,
  FormContainer,
  Input,
  InputGroup,
  Label,
  LoginContainer,
  RootContainer,
} from './styled'
import useLogin from './hooks/useLogin'
import { Typography } from '@mui/material'

const LoginPage = () => {
  const { username, setUsername, password, setPassword, login } = useLogin()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login()
  }

  return (
    <RootContainer>
      <LoginContainer>
        <Typography variant="h4" color="#d56f2c">
          Sign in
        </Typography>
        <FormContainer onSubmit={handleLogin}>
          <InputGroup>
            <Label htmlFor="username">Username:</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="password">Password:</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>
          <Button type="submit">Login</Button>
        </FormContainer>
      </LoginContainer>
    </RootContainer>
  )
}

export default LoginPage
