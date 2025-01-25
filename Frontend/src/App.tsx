import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignIn from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
// import UserProfile from "./components/Profile";
import SocketProvider from "./context/SocketProvider";

const App: React.FC = () => {
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
