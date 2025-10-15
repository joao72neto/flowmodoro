type ButtonProps = {
  icon?: React.ReactNode;
  text?: string;
};

function Button({ icon, text}: ButtonProps) {
  return (
    <button>
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
}

export default Button;