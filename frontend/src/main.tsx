import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./features/home/Home";
import Providers from "./app/Providers";
import { getSerwist } from "virtual:serwist";

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
