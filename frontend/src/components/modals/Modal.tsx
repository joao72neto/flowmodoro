import Button from "../Button";

const Modal = ({
  title,
  children,
  buttonText,
}: {
  title: string;
  children: React.ReactNode;
  buttonText?: string;
}) => {
  return (
    <div className="flex items-center justify-center absolute inset-0">
      <div className="bg-black absolute inset-0 opacity-50 z-50"></div>

      <div className="flex flex-col gap-2 z-55 bg-white text-black sm:w-1/3 w-2/3 rounded-xl p-6 text-center">
        {title && <h1 className="font-bold text-xl">{title}</h1>}

        <div className="text-gray-800">{children}</div>

        <Button>{buttonText ?? "Close"}</Button>
      </div>
    </div>
  );
};

export default Modal;
