import Button from "./Button";

const Modal = ({
  title,
  children,
  buttonText,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  buttonText?: string;
  onClose?: () => void;
}) => {
  return (
    <div className="flex items-center justify-center absolute inset-0">
      <div className="bg-black absolute inset-0 opacity-50 z-50"></div>

      <div className="flex flex-col border border-white/10 gap-3 z-55 backdrop-blur-2xl bg-white/10 text-white sm:w-1/3 w-2/3 rounded-xl p-6 text-center">
        {title && <h1 className="font-bold text-xl">{title}</h1>}

        <div>{children}</div>

        <Button onClick={onClose} variant="secondary">
          {buttonText ?? "Close"}
        </Button>
      </div>
    </div>
  );
};

export default Modal;
