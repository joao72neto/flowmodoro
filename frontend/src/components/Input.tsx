function Input({
  placeholder,
  onKeyDown,
  onChange,
  value
}: {
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}) {
  return (
    <input
      className="flex-grow px-4 py-2 text-white rounded-l border-1 border-white/10 focus:outline-none"
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      onChange={onChange}
      value={value}
    />
  );
}

export default Input;
