import React, { useState, useEffect } from 'react'
import {
  CardContainer,
  Button,
  Input,
  Label,
  RootContainer,
} from './styled'
import { Typography } from '@mui/material'
import useDeviceList from './hooks/useDeviceList'

const DevicesPage = () => {
  const {
    removeDevice,
    addDevice,
    devices,
    loading,
    error,
    deviceCode,
    setDeviceCode,
    password,
    setPassword,
    enterRoom,
  } = useDeviceList()

  return (
    <RootContainer>
      <Typography variant="h3" color="#d56f2c" sx = {{marginBottom:'10px'}}>
        User Devices
      </Typography>
      <CardContainer>
      <div style={{width:'540px'}}><Typography variant='h5' color = "#d56f2c" sx = {{alignSelf:'flex-start'}}>Adding Device</Typography></div>
      <div style={{ display: 'flex', alignItems: 'center', color: '#d56f2c' }}>
        <div style={{width:'fit-content'}}>
        <Label htmlFor="deviceCode">Device Code: </Label>
        <Input
          type="text"
          id="deviceCode"
          placeholder="Device Code"
          value={deviceCode}
          onChange={(e) => setDeviceCode(e.target.value)}
        />
        </div>
        <div style={{width:'fit-content'}}> 
        <Label htmlFor="password">Password: </Label>
        <Input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        <Button onClick={addDevice} style= {{marginTop:'23px'}}>Add Device</Button>
      </div>
      </CardContainer>


      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <CardContainer>
        <Typography variant='h5' color = '#d56f2c'>List of devices</Typography>
        <ul style = {{backgroundColor:'#5e3113', color: 'white' , padding: '10px'}}>
          {devices.map((device) => (
            <li
              key={device.deviceCode}
              style={{ display: 'flex', flexDirection: 'row', gap: '25px' }}
            >
              <Typography variant='h6' style={{paddingTop: '5px'}}>
                Device: {device.deviceCode}
              </Typography>
              <Button onClick={() => {
                  enterRoom(device.deviceCode)
                }}>
                Join 
              </Button>
              <Button onClick={() => removeDevice(device.deviceCode)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
        </CardContainer>
      )}
    </RootContainer>
  )
}

export default DevicesPage
