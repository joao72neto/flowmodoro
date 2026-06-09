function IconButton({
  icon,
  onClick,
  title,
  disabled,
}: {
  icon?: React.ReactNode;
  onClick?: () => void;
  title?: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      title={title}
      className="text-xl cursor-pointer"
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

export default IconButton;
