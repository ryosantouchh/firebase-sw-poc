importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.4.0/firebase-messaging-compat.js")

const firebaseConfig = {
  apiKey: 'AIzaSyBoHmt_K78N4NmQLDZpGIL7j0Dr5dHpjpI',
  authDomain: 'fir-cloud-message-e5165.firebaseapp.com',
  projectId: 'fir-cloud-message-e5165',
  storageBucket: 'fir-cloud-message-e5165.appspot.com',
  messagingSenderId: '100493110875',
  appId: '1:100493110875:web:f237cd571dd2a4cb32997e',
  measurementId: 'G-HQH2PL86LH',
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage(
  (payload) => {
  console.log('[firebase-messaging-sw] receive :: ', payload)

  const notificationTitle = payload.notification.notificationTitle
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  }

  if (notificationTitle) {
    // comment line below because it can throw the duplicated notificaiton to us
    self.registration.showNotification(notificationTitle, notificationOptions)
  }
})
