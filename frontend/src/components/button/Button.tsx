type ButtonProps = {
  icon?: React.ReactNode;
  text?: string;
};

function Button({ icon, text }: ButtonProps) {
  return (
    <button
      className="
      bg-black
      text-white 
        pt-3 
        pb-3 
        w-20 
        rounded-full 
        cursor-pointer 
        hover:shadow-[0_0_10px_#ffffff20] 
        transition
        duration-500"
    >
      {icon && <span>{icon}</span>}
      {text && <span>{text}</span>}
    </button>
  );
}

export default Button;
