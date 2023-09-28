import React, { useState } from 'react'
import { Button, Input, InputGroup, Label, LoginContainer } from './styled'
import useLogin from './hooks/useLogin'

const LoginPage = () => {
  const { username, setUsername, password, setPassword, login } = useLogin()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    login()
  }

  return (
    <LoginContainer>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
      </form>
    </LoginContainer>
  )
}

export default LoginPage
