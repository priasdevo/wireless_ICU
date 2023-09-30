import React, { useState, useEffect } from 'react'
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
    <div>
      <h1>User Devices</h1>

      <div>
        <input
          type="text"
          placeholder="Device Code"
          value={deviceCode}
          onChange={(e) => setDeviceCode(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={addDevice}>Add Device</button>
      </div>

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
              <button onClick={() => removeDevice(device.deviceCode)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DevicesPage
