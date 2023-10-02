import {Card,styled} from '@mui/material'

export const RootContainer = styled('div')`
  background-color: #f0e2a3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10%;
`

export const RegisterContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  background-color: #f9d4bb;
  width: 40vw;
  height: 50vh;
  justify-content: center;
  align-items: center;
  padding-bottom: 140px;
`

export const FormContainer = styled('form')`
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  color: #ED7C31; 
  width: 400px;
  height: 150px;
`

export const InputGroup = styled('div')`
  margin-bottom: 15px;
`

export const Label = styled('label')`
  display: block;
  margin-bottom: 5px;
`

export const Input = styled('input')`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`

export const Button = styled('button')`
  width: 100%;
  margin-top: 6px;
  padding: 10px 15px;
  background-color: #ED7C31;
  font-size: 20px;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #f0965a;
  }
`
