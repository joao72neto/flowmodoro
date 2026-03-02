function IconButton({
  icon,
  onClick,
}: {
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className="text-xl cursor-pointer" onClick={onClick}>
      {icon}
    </button>
  );
}

export default IconButton;
