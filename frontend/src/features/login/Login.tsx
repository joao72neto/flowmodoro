import AuthContainer from "./components/AuthContainer";
import LoginForm from "./components/forms/LoginForm";
import RegisterForm from "./components/forms/RegisterForm";
import { useState } from "react";
import PasswordRecovery from "./components/forms/PasswordRecovery";

const Login = () => {
  const [tab, setTab] = useState<"login" | "register" | "forgot-password">(
    "login",
  );

  return (
    <div className="flex min-h-0 h-screen">
      <AuthContainer>
        {tab === "login" && (
          <LoginForm
            onForgorPassword={() => setTab("forgot-password")}
            onRegister={() => setTab("register")}
          />
        )}
        {tab === "register" && (
          <RegisterForm onReturn={() => setTab("login")} />
        )}
        {tab === "forgot-password" && (
          <PasswordRecovery onReturn={() => setTab("login")} />
        )}
      </AuthContainer>

      <div className="flex items-center flex-1 bg-neutral-20"></div>
    </div>
  );
};

export default Login;
