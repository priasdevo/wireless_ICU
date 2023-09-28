import React, { useState, useEffect } from 'react'

interface Device {
  id: string
  name: string
}

const DevicesPage = () => {
  const [devices, setDevices] = useState<Array<Device>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceCode, setDeviceCode] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = () => {
    fetch('http://backend-url.com/api/user/devices')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setDevices(data.devices)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }

  const addDevice = () => {
    fetch('http://backend-url.com/api/user/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceCode, password }),
    })
      .then((response) => response.json())
      .then(() => fetchDevices())
      .catch((error) => setError(error.message))
  }

  const removeDevice = (id: string) => {
    fetch(`http://backend-url.com/api/user/devices/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => fetchDevices())
      .catch((error) => setError(error.message))
  }

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
            <li key={device.id}>
              {device.name}
              <button onClick={() => removeDevice(device.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DevicesPage
