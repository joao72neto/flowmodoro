import AuthContainer from "./components/AuthContainer";
import LoginForm from "./components/LoginForm";

const Login = () => {
  return (
    <div className="flex min-h-0 h-screen">
      <AuthContainer>
        <LoginForm />
      </AuthContainer>

      <div className="flex items-center flex-1 bg-neutral-20"></div>
    </div>
  );
};

export default Login;
