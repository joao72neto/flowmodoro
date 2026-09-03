import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./HomePage";
import Login from "../features/login/AuthPage";
import ResetPasswordPage from "../features/login/ResetPasswordPage";
import { useState, useEffect } from "react";
import LoadingScreen from "./MainLayout/LoadingScreen";

export const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
