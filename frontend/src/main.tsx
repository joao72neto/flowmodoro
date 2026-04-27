import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./features/home/Home";

import Providers from "./app/Providers";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("SW registration failed: ", error);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Home />
    </Providers>
  </StrictMode>,
);
