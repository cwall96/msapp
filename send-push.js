// send-push.js
import fetch from 'node-fetch';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

const sendNotification = async (token, message) => {
  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      sound: 'default',
      title: 'Ms Symptom Check Reminder',
      body: message,
    }),
  });
  const data = await res.json();
  console.log(data);
};

const run = async () => {
  const snapshot = await db.collection('pushTokens').get();
  for (const doc of snapshot.docs) {
    const { token } = doc.data();
    if (token?.startsWith('ExponentPushToken')) {
      await sendNotification(token, 'Time to complete your daily CuePD check-in!');
    }
  }
};

run();
