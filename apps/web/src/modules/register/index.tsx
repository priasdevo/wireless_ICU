import React, { useState } from 'react'
import { RegisterContainer, InputGroup, Label, Input, Button } from './styled'

interface RegisterProps {
  onRegister?: (username: string, password: string, email: string) => void
}

const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // if (onRegister) {
    //   onRegister(username, password, email)
    // }
  }

  return (
    <RegisterContainer>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <Button type="submit">Register</Button>
      </form>
    </RegisterContainer>
  )
}

export default RegisterPage
