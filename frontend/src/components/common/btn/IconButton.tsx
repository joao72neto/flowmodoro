function IconButton({
  icon,
  onClick,
}: {
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return <button onClick={onClick}>{icon}</button>;
}

export default IconButton;
