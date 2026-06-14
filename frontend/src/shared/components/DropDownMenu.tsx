import { useEffect, useRef, useState } from "react";

interface Item {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded hover:bg-neutral-60 hover:cursor-pointer"
      >
        {children}
      </button>

      {open && items.length > 0 && (
        <div className="absolute right-0 mt-2 w-40 bg-neutral-100 border border-border rounded shadow-lg z-10">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left hover:bg-neutral-60"
            >
              <div className="flex items-center gap-2">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
