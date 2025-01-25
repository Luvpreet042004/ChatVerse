import admin from "firebase-admin";

const serviceAccount = require("./config/securityAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
