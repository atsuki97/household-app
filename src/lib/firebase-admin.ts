import admin from 'firebase-admin';

const adminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(adminConfig),
    })
  : admin.app();

export const verifyIdToken = async (token: string) => {
  return await admin.auth(app).verifyIdToken(token);
};