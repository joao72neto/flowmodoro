import { useNavigate } from "react-router-dom";
import { PiCaretLeftBold } from "react-icons/pi";
import clsx from "clsx";

const ReturnTitle = ({
  children,
  path,
  className,
  onClick,
}: {
  children: string;
  path?: string;
  className?: string;
  onClick?: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <div className={clsx("flex items-center", className)}>
      <button
        className="cursor-pointer hover:-translate-x-1 duration-100 pr-1"
        onClick={() => (path && !onClick ? navigate(path) : onClick?.())}
      >
        <PiCaretLeftBold size={24} />
      </button>
      <h1 className={"text-2xl"}>{children}</h1>
    </div>
  );
};

export default ReturnTitle;
