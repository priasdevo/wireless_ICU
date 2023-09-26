import styled from 'styled-components'

export const RegisterContainer = styled.div`
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`

export const InputGroup = styled.div`
  margin-bottom: 15px;
`

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`

export const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`
