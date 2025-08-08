// send-push.js (CommonJS version)
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const sendPushNotification = async (expoPushToken, message) => {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title: 'MSTracker',
      body: message,
    }),
  });

  const data = await response.json();
  console.log('✅ Sent:', data);
};

(async () => {
  const snapshot = await db.collection('pushTokens').get();

  if (snapshot.empty) {
    console.log('No tokens found');
    return;
  }

  snapshot.forEach(doc => {
    const token = doc.data().token;
    sendPushNotification(token, 'Please make sure you fill out your daily symptoms!');
  });
})();
