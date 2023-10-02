import styled from 'styled-components'

export const NavWrapper = styled.div`
  background-color: #333;
  overflow: hidden;
`

export const NavLink = styled.a`
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;

  &:hover {
    background-color: #ddd;
    color: black;
  }
`
