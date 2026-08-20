import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./HomePage";
import Login from "../features/login/AuthPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
