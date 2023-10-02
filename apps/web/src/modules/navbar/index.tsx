import React, { useEffect, useState } from 'react'
import { NavWrapper, NavLink } from './styled'

const Navbar: React.FC = () => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // This will ensure that localStorage is accessed only on the client side.
    console.log('token : ', localStorage.getItem('token'))
    setToken(localStorage.getItem('token'))
  }, [])
  return (
    <NavWrapper>
      {token ? (
        <>
          <NavLink href="/device/list">Devices</NavLink>
          <NavLink href="/notification">Notification</NavLink>
        </>
      ) : (
        <>
          <NavLink href="/login">Login</NavLink>
          <NavLink href="/register">Register</NavLink>
        </>
      )}
    </NavWrapper>
  )
}

export default Navbar
