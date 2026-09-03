import AuthContainer from "./components/AuthContainer";
import LoginForm from "./components/forms/LoginForm";
import RegisterForm from "./components/forms/RegisterForm";
import { useState } from "react";
import PasswordRecovery from "./components/forms/PasswordRecovery";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx";

const Login = () => {
  const [tab, setTab] = useState<"login" | "register" | "forgot-password">(
    "login",
  );

  return (
    <div className="flex min-h-0 h-screen">
      <AuthContainer>
        <AnimatePresence mode="wait">
          {tab === "login" && (
            <LoginForm onRegister={() => setTab("register")} />
          )}
          {tab === "register" && (
            <RegisterForm onReturn={() => setTab("login")} />
          )}
          {tab === "forgot-password" && (
            <PasswordRecovery onReturn={() => setTab("login")} />
          )}
        </AnimatePresence>
      </AuthContainer>

      <div
        className={clsx(
          "flex items-center flex-1",
          "bg-gradient-to-b from-neutral-60 to-neutral-10",
        )}
      ></div>
    </div>
  );
};

export default Login;
