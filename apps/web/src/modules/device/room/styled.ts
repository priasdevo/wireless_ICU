import { Card, styled } from "@mui/material";

export const CardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  background-color: #f9d4bb;
  width: fit-content;
  justify-content: center;
  align-items: center;
  padding: 32px;
  gap: 20px;
  margin-top:10px;
`

export const Input = styled('input')`
  width: fit-content;
  padding: 10px;
  margin-right: 20px;
  box-sizing: border-box;
`

export const Label = styled('label')`
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
  color: #ed7c31;
`