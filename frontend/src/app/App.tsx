import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./HomePage";
import Login from "../features/login/AuthPage";
import ResetPasswordPage from "../features/login/ResetPasswordPage";

export const App = () => {
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
