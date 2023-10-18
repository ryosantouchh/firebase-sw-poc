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
  //   const isRegisterSW = allRegistration.some((registration) => registration.active.scriptURL === `${window.location.origin}/firebase-messaging-sw.js`)

  //   if (isRegisterSW) {
  //     setIsRegister(true)
  //   }

  //   console.log(isRegisterSW)
  //   return isRegisterSW
  // }

  const unregisterServiceWorker = async () => {
    const allRegistrations = await navigator.serviceWorker.getRegistrations()
    const registerIndex = allRegistrations.findIndex((registration) => registration.active.scriptURL === `${window.location.origin}/firebase-messaging-sw.js`)
    const firebaseMessageSW = allRegistrations[registerIndex]
  
    const unregistration = await firebaseMessageSW.unregister()
    console.log(unregistration)
  }

  useEffect(() => {
    window.addEventListener('load', registerServiceWorker)
    window.addEventListener('beforeunload', unregisterServiceWorker)

    return () => {
      window.removeEventListener('beforeunload', unregisterServiceWorker)
      window.removeEventListener('load', registerServiceWorker)
    }
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
