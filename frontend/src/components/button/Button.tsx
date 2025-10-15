import "./Button.css"

type ButtonProps = {
  icon?: React.ReactNode;
  text?: string;
};

function Button({ icon, text }: ButtonProps) {
  return (
    <button id="btn-flow" className="p-4 rounded-full cursor-pointer">
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
}

export default Button;
