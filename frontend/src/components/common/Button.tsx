const bgColors = {
  secondary: "#6c757d",
  danger: "#dc3545",
};

function Button({
  icon,
  variant,
  text,
}: {
  icon?: React.ReactNode;
  variant?: "secondary" | "danger";
  text?: string;
}) {
  return (
    <button
      className="
        px-5 
        py-2 
        rounded-2xl 
        cursor-pointer 
        font-semibold 
        text-white 
        border-white/10
        hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] 
        transition"
      style={{ backgroundColor: variant ? bgColors[variant] : "#000" }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </button>
  );
}

export default Button;
