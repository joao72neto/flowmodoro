import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Providers from "./app/Providers";
import { getSerwist } from "virtual:serwist";
import App from "./app/App";

import { initSync } from "./local/sync/sync-manager";

initSync();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);

window.addEventListener("load", () => {
  void getSerwist();
});
