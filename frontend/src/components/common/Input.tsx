function Input({ placeholder }: { placeholder: string }) {
  return (
    <input
      className="flex-grow px-4 py-2 text-white rounded-l border-1 border-gray-600"
      placeholder={placeholder}
    />
  );
}

export default Input;
