import React from 'react'
import useNotificationList from './hooks/useNotificationList'
import { Button, CardContainer, RootContainer } from './styled'
import { Typography } from '@mui/material'
import { useRouter } from 'next/router'

const NotificationsPage: React.FC = () => {
  const { notifications } = useNotificationList()
  const router = useRouter()
  return (
    <RootContainer>
      <Typography variant="h3" color="#d56f2c" style={{}}>
        Notifications
      </Typography>
      <CardContainer>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '270px' }}>
          <Typography variant="h5" color="#d56f2c">
            Device Code
          </Typography>
          <Typography
            variant="h5"
            color="#d56f2c"
            style={{ marginRight: '180px' }}
          >
            Time
          </Typography>
        </div>
        <ul>
          {notifications &&
            notifications?.map((notification) => (
              <CardContainer
                sx={{
                  padding: '10px',
                  marginBottom: '25px',
                  backgroundColor: '#ed7c31',
                }}
              >
                <li
                  key={notification.device}
                  style={{ margin: '20px', listStyleType: 'none' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '100px',
                    }}
                  >
                    <Typography variant="h6" color="#fdf1ea">
                      {notification.device}
                    </Typography>
                    <Typography variant="h6" color="#fdf1ea">
                      {' '}
                      {notification.timestamp.toLocaleString()}
                    </Typography>
                    <Button
                      onClick={() => {
                        router.push(`/notification/${notification._id}`)
                      }}
                    >
                      Join
                    </Button>
                  </div>
                </li>
              </CardContainer>
            ))}
        </ul>
      </CardContainer>
    </RootContainer>
  )
}

export default NotificationsPage
