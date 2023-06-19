import { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../context/socketContext'
import useAuth from './useAuth'
import { useAuthContext } from '../context/authContext'

type Notification = {
  to: Array<string>
  title: string
  body: string
  data: {
    date: Date
    type: string
    to: string
    id: string
  }
}

type fn = () => {}

const useNotifications = (): [Array<Notification>, fn] => {
  const socket = useContext(SocketContext)
  const [notifications, setNotifications] = useState([] as Array<Notification>)
  const { user } = useAuth()

  useEffect(() => {
    if (!socket) return
    const receive = (notifications: Array<Notification>) => {
      if (!user) return
      setNotifications(
        notifications.filter((n) => n.data?.to?.includes(user?.id))
      )
    }
    socket.on('notifications', receive)

    return () => {
      socket.off('notifications', receive)
    }
  }, [user, socket])

  const refresh = () =>
    socket.emit('notifications', (notifications: Array<Notification>) =>
      setNotifications(notifications)
    )

  return [notifications, refresh]
}

export default useNotifications
