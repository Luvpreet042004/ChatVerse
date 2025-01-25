// // src/services/auth.ts
// import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
// import app from "../firebase-config";

// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();

// export const signInWithGoogle = async () => {
//     try {
//         const result = await signInWithPopup(auth, provider);
//         const user = result.user;
//         return user;
//     } catch (error) {
//         console.error("Google Sign-In Error:", error);
//         throw error;
//     }
// };

// export const logOut = async () => {
//     try {
//         await signOut(auth);
//     } catch (error) {
//         console.error("Sign-Out Error:", error);
//         throw error;
//     }
// };
