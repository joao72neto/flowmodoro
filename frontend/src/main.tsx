import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Providers from "./app/Providers";
import { getSerwist } from "virtual:serwist";
import Home from "./app/Home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <Home />
    </Providers>
  </StrictMode>,
);

window.addEventListener("load", () => {
  void getSerwist();
});
