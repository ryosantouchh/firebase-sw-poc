import { useEffect, useState } from 'react'
import { messaging } from './configs/firebase'
import { getToken } from 'firebase/messaging'
import './App.css'

function App() {
  const [token, setToken] = useState(null)
  const [isRegister, setIsRegister] = useState(false)

  const subscribeMessaging = async () => {
    if (!token) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        // Generate Token
        const vapidKey = import.meta.env.FIREBASE_VAPID_KEY
        const token = await getToken(messaging, { vapidKey })
        setToken(token)
      } else if (permission === 'denied') {
        alert('You denied for the notification')
      }
    }
  }

  const registerServiceWorker = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: 'firebase-cloud-messaging-push-scope' })
        setIsRegister(true)
        console.log('Service Worker registered with scope:', registration)
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  // const checkServiceWorkerRegister = async () => {
  //   const allRegistration = await navigator.serviceWorker.getRegistrations()

  //   const isRegisterSW = allRegistration.some((registration) => registration.scope === "http://127.0.0.1:5173/firebase-cloud-messaging-push-scope")

  //   if (!isRegisterSW) {
  //     await registerServiceWorker()
  //   }
  // }

  useEffect(() => {
    // checkServiceWorkerRegister()
  }, [])

  return (
    <div style={{width: '300px'}}>
      <p>Push Notification</p>
      { isRegister 
        ? <button onClick={() => subscribeMessaging()}>Subscribe</button>
        : <button onClick={() => registerServiceWorker()}>Register SW</button>
      }
      <p style={{wordBreak: 'break-word'}}>Token : {token}</p>
    </div>
  )
}

export default App
