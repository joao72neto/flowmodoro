import { useNavigate } from "react-router-dom";
import { PiCaretLeftBold } from "react-icons/pi";
import clsx from "clsx";

const ReturnTitle = ({
  children,
  path,
  className,
}: {
  children: string;
  path?: string;
  className?: string;
}) => {
  const navigate = useNavigate();

  return (
    <div className={clsx("flex items-center", className)}>
      <button
        className="cursor-pointer hover:-translate-x-1 duration-100 pr-1"
        onClick={() => (path ? navigate(path) : window.history.back())}
      >
        <PiCaretLeftBold size={24} />
      </button>
      <h1 className={"text-2xl"}>{children}</h1>
    </div>
  );
};

export default ReturnTitle;
