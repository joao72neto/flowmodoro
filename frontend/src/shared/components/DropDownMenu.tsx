import { useEffect, useRef, useState } from "react";

interface Item {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

import clsx from "clsx";

const DropdownMenu = ({
  children,
  items,
}: {
  children: React.ReactNode;
  items: Item[];
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      {open && items.length > 0 && (
        <div
          className={clsx(
            "absolute right-0 mt-2 w-48 origin-top-right z-50 overflow-hidden",
            "bg-neutral-80 border border-border rounded-xl shadow-xl",
            "animate-in fade-in zoom-in duration-100",
          )}
        >
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
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
