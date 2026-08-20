import Input from "./Input";

const InputGroup = ({
  label = "Label",
  placeholder = "Digite o valor",
}: {
  label: string;
  placeholder: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <Input placeholder={placeholder} />
    </div>
  );
};

export default InputGroup;
