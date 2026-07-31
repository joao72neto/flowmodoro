import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Providers from "./app/Providers";
import { getSerwist } from "virtual:serwist";
import Home from "./app/Home";

import { initSync } from "./local/sync/sync-manager";

import { registerPlugin } from "@capacitor/core";

interface HelloPlugin {
  hello(): Promise<{ message: string }>;
}

const HelloPlugin = registerPlugin<HelloPlugin>("Hello");

const res = await HelloPlugin.hello();

console.log(res.message);

initSync();

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
