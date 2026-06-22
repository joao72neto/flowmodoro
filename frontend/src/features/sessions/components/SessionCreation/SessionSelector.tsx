import clsx from "clsx";
import DropdownContainer from "../../../../shared/components/Dropdown/DropdownContainer";
import { useRef, useState } from "react";
import { useClickOutside } from "../../../../shared/hooks/useClickOutside";
import Input from "../../../../shared/components/inputs/Input";
import { GoSearch } from "react-icons/go";
import type { ProjectType } from "../../../projects/projects.types";
import type { TagType } from "../../../tags/tags.types";
import Button from "../../../../shared/components/buttons/Button";
import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";

const SessionSelector = ({
  children,
  title = "Title",
  icon,
  items = [],
  variant = "primary",
  placeholder = "Pesquise aqui...",
}: {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  items?: ProjectType[] | TagType[];
  variant?: "primary" | "secondary";
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeItemId, setActiveItemId] = useState(0);
  const [selectedItem, setSelectedItem] = useState<
    ProjectType | TagType | null
  >(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const borderColor =
    variant === "primary" ? "border-primary" : "border-secondary";
  const bgColor = variant === "primary" ? "bg-primary/70" : "bg-secondary/70";

  const isActive = (id: number) => id === activeItemId;

  const handleConfirmItem = () => {
    setSelectedItem(items.find((item) => item.id === activeItemId) || null);
    setIsOpen(false);
  };

  const handleClearItem = () => {
    setSelectedItem(null);
    setActiveItemId(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "flex items-center gap-2 border border-border p-2 rounded-lg hover:cursor-pointer",
          "bg-neutral-80 line-clamp-1",
          selectedItem && bgColor,
        )}
      >
        {icon && <span>{icon}</span>}
        <span>{selectedItem ? selectedItem.name : children}</span>
      </div>
      <DropdownContainer
        className="p-4 left-0! sm:right-0! sm:left-auto! w-50! sm:w-60!"
        isOpen={isOpen}
      >
        <div className="flex flex-col">
          {title}

          <Input
            icon={<GoSearch />}
            variant={variant}
            placeholder={placeholder}
            className="my-4"
          />

          <div
            className={clsx(
              "flex flex-col gap-2 max-h-43 overflow-y-auto contain-content scrollbar-hidden",
            )}
          >
            {items.map((item) => (
              <div
                className={clsx(
                  "group flex items-center gap-2 hover:cursor-pointer p-2 rounded-lg border border-border",
                  isActive(item.id) && borderColor,
                )}
                onClick={() => setActiveItemId(item.id)}
                key={item.id}
              >
                <div
                  className={clsx(
                    "p-2 border border-border rounded-full",
                    isActive(item.id) && borderColor,
                  )}
                />
                {item.name}
              </div>
            ))}
          </div>
          <AnimatedCollapse show={!!activeItemId}>
            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="secondary"
                className="w-full text-sm!"
                onClick={handleClearItem}
              >
                Limpar
              </Button>
              <Button
                variant="primary"
                className="w-full text-sm!"
                onClick={handleConfirmItem}
              >
                Confirmar
              </Button>
            </div>
          </AnimatedCollapse>
        </div>
      </DropdownContainer>
    </div>
  );
};

export default SessionSelector;
