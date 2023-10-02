import React, { useState, useEffect } from 'react'
import { Button, CardContainer, Input, RootContainer } from './styled'
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
      <Typography variant="h3" color="#d56f2c">
        User Devices
      </Typography>
      <CardContainer>
        <Input
          type="text"
          placeholder="Device Code"
          value={deviceCode}
          onChange={(e) => setDeviceCode(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={addDevice}>Add Device</Button>
      </CardContainer>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <ul>
          {devices.map((device) => (
            <li
              key={device.deviceCode}
              style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}
            >
              <p>{device.macAddress}</p>
              <p
                onClick={() => {
                  enterRoom(device.deviceCode)
                }}
              >
                {device.deviceCode}
              </p>
              <Button onClick={() => removeDevice(device.deviceCode)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}
    </RootContainer>
  )
}

export default DevicesPage
