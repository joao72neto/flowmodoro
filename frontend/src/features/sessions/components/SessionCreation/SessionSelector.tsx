import clsx from "clsx";
import DropdownContainer from "../../../../shared/components/Dropdown/DropdownContainer";
import { useRef, useState } from "react";
import { useClickOutside } from "../../../../shared/hooks/useClickOutside";

const SessionSelector = ({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "flex items-center gap-2 border border-border p-2 rounded-lg hover:cursor-pointer",
          "bg-neutral-80 max-w-30 line-clamp-1",
        )}
      >
        {icon && <span>{icon}</span>}
        <span>{children}</span>
      </div>
      <DropdownContainer className="p-4 w-60!" isOpen={isOpen}>
        Test Dropdown
      </DropdownContainer>
    </div>
  );
};

export default SessionSelector;
