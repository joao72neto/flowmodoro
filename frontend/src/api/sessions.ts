import http from "./http";

export const getSession = () => http.get("/session");
export const createSession = (data: any) => http.post("/session", data);
