import { useRef, useState } from "react";

interface Item {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

import clsx from "clsx";
import DropdownContainer from "./DropdownContainer";
import { useClickOutside } from "../../hooks/useClickOutside";

const DropdownMenu = ({
  children,
  items,
}: {
  children: React.ReactNode;
  items: Item[];
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = items.length > 0 && open;

  useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div className={clsx("relative inline-block text-left")} ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          "flex items-center justify-center rounded-lg transition-colors cursor-pointer",
        )}
      >
        {children}
      </button>

      <DropdownContainer isOpen={isOpen}>
        <div>
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
              className={clsx(
                "flex items-center w-full px-4 py-2.5 gap-3 group transition-colors",
                "text-sm font-medium text-neutral-10 hover:bg-neutral-60",
              )}
            >
              {item.icon && (
                <span className="text-neutral-40 group-hover:text-neutral-10 transition-colors">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </DropdownContainer>
    </div>
  );
};

export default DropdownMenu;
