import { GoInbox } from "react-icons/go";
import clsx from "clsx";

interface EmptyTagsProps {
  title?: string;
  message?: string;
}

function EmptyTags({
  title = "Nenhuma tag encontrada",
  message = "Tente ajustar sua busca ou crie uma nova tag para começar.",
}: EmptyTagsProps) {
  return (
    <div className={clsx(
      "flex flex-col gap-3 justify-center items-center w-full py-10 opacity-60",
      "animate-in fade-in slide-in-from-bottom-4 duration-500"
    )}>
      <div className="flex flex-col items-center gap-2 text-neutral-10">
        <GoInbox size={40} />
        <h2 className="text-xl font-semibold text-center m-0!">{title}</h2>
      </div>
      <p className="text-neutral-20 max-w-[280px] text-center text-sm leading-relaxed">
        {message}
      </p>
    </div>
  );
}

export default EmptyTags;
