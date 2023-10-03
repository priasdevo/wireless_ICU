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

export const Button = styled('button')`
  width: max-content;
  margin-top: 2px;
  padding: 10px 20px;
  background-color: #ed7c31;
  font-size: 18px;
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