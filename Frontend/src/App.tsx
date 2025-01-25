import React,{useEffect} from "react";
import { getAuth,onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
// import UserProfile from "./components/Profile";
import SocketProvider from "./context/SocketProvider";

const App: React.FC = () => {
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in; refresh the token
        const token = await user.getIdToken(true); // `true` forces token refresh
        localStorage.setItem("authToken", token); // Store the fresh token
        console.log("Token refreshed:", token);
      } else {
        // User is signed out
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName")
        localStorage.removeItem("userEmail")
        console.log("User is signed out.");
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/signup" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        {/* Dashboard Route with Nested Routing */}
        <Route
          path="/dashboard/*"
          element={
            <SocketProvider>
              <Dashboard />
            </SocketProvider>
          }
        />

        {/* Fallback Route for Undefined Paths */}
        <Route path="*" element={<SignIn />} />
      </Routes>
    </Router>
  );
};

export default App;
