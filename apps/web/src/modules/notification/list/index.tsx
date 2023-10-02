import React from 'react'
import useNotificationList from './hooks/useNotificationList'

const NotificationsPage: React.FC = () => {
  const { notifications } = useNotificationList()

  return (
    <div>
      <h1>Notifications</h1>

      <ul>
        {notifications &&
          notifications?.map((notification) => (
            <li key={notification.device}>
              <p>{notification.device}</p>
              <span>{notification.timestamp.toLocaleString()}</span>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default NotificationsPage
