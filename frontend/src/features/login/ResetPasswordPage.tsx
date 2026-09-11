import AuthContainer from "./components/AuthContainer";
import ResetPasswordForm from "./components/forms/ResetPasswordForm";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import clsx from "clsx";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");

  useEffect(() => {
    navigate("/login?alert=not_available", { replace: true });
  }, []);

  if (!code) return null;

  return (
    <div className="flex min-h-0 h-screen">
      <AuthContainer>
        <ResetPasswordForm code={code} />
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

export default ResetPasswordPage;
