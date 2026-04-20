import clsx from "clsx";

function Input({
  placeholder,
  onKeyDown,
  onChange,
  value,
}: {
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}) {
  return (
    <input
      className={clsx(
        "flex-grow px-4 py-2 text-white rounded-md border border-white/10 ",
        "focus:border-danger focus:outline-none transition-colors duration-200 ease-in-out",
      )}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      onChange={onChange}
      value={value}
    />
  );
}

export default Input;
