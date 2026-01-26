import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home";
import "bootstrap-icons/font/bootstrap-icons.css";
import { TaskProvider } from "./contexts/TaskContext";
import { SessionProvider } from "./contexts/SessionContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SessionProvider>
      <TaskProvider>
        <Home />
      </TaskProvider>
    </SessionProvider>
  </StrictMode>,
);
