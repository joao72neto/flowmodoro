import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.joao.flowmodoro",
  appName: "flowmodoro",
  webDir: "dist",

  server: {
    url: "http://192.168.15.3:5173",
    cleartext: true,
  },
};

export default config;
