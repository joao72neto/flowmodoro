function IconButton({
  icon,
  onClick,
  title,
}: {
  icon?: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button title={title} className="text-xl cursor-pointer" onClick={onClick}>
      {icon}
    </button>
  );
}

export default IconButton;
