function Button({
  color,
  backgroundColor,
  text,
}: {
  color?: string;
  backgroundColor?: string;
  text?: string;
}) {
  return (
    <button
      className="px-6 py-2 rounded"
      style={{ backgroundColor: backgroundColor, color: color }}
    >
      {text}
    </button>
  );
}

export default Button;
