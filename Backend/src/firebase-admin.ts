import admin from "firebase-admin";

// Load environment variables
require("dotenv").config();

// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
});

export interface DecodedIdToken {
    uid: string;
    email?: string; 
}

export const verifyToken = async (token: string): Promise<DecodedIdToken> => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Token verification failed:", error);
        throw error;
    }
};
