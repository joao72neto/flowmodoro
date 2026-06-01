import clsx from "clsx";

function Input({
  placeholder,
  onKeyDown,
  onChange,
  value,
  className,
  disabled,
}: {
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <input
      disabled={disabled}
      className={clsx(
        "flex-grow px-4 py-2 text-neutral-10 rounded-md border border-border bg-neutral-80/50",
        "focus:border-danger focus:outline-none transition-colors duration-200 ease-in-out",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      onChange={onChange}
      value={value}
    />
  );
}

export default Input;
