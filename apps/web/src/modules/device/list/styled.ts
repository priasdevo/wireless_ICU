import { Card, styled } from '@mui/material'

export const RootContainer = styled('div')`
  background-color: #f0e2a3;
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10%;
`

export const CardContainer = styled(Card)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  background-color: #f9d4bb;
  width: 60vw;
  height: 50vh;
  justify-content: center;
  align-items: center;
  padding-bottom: 7%;
`
export const Input = styled('input')`
  width: 30%;
  padding: 10px;
  box-sizing: border-box;
`

export const Button = styled('button')`
  width: 20%;
  margin-top: 2px;
  padding: 10px 20px;
  background-color: #ED7C31;
  font-size: 10px;
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