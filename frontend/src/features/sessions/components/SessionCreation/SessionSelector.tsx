import clsx from "clsx";
import DropdownContainer from "../../../../shared/components/Dropdown/DropdownContainer";
import { useEffect, useState } from "react";
import { useClickOutside } from "../../../../shared/hooks/useClickOutside";
import Input from "../../../../shared/components/inputs/Input";
import { GoSearch } from "react-icons/go";
import type { ProjectType } from "../../../projects/projects.types";
import type { TagType } from "../../../tags/tags.types";
import Button from "../../../../shared/components/buttons/Button";
import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import { useFloating, offset, flip, shift } from "@floating-ui/react";

const SessionSelector = ({
  children,
  title = "Title",
  icon,
  items = [],
  variant = "primary",
  placeholder = "Pesquise aqui...",
  align = "left",
  value,
  onChange,
  disabled = false,
}: {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  items?: ProjectType[] | TagType[];
  variant?: "primary" | "secondary";
  placeholder?: string;
  align?: "left" | "right";
  value: ProjectType | TagType | null;
  onChange: (item: any) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: align === "left" ? "bottom-start" : "bottom-end",
    middleware: [offset(8), flip(), shift()],
  });

  const [activeItemId, setActiveItemId] = useState(value?.id || 0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setActiveItemId(value?.id || 0);
  }, [value]);

  useClickOutside(refs.floating, () => {
    setIsOpen(false);
    setSearchQuery("");
  });

  const isActive = (id: number) => id === activeItemId;

  const handleConfirmItem = () => {
    const item = items.find((item) => item.id === activeItemId) || null;
    onChange(item);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClearItem = () => {
    onChange(null);
    setActiveItemId(0);
    setSearchQuery("");
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative" ref={refs.setReference}>
      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={clsx(
          "flex items-center gap-2 border p-2 rounded-lg transition-all duration-200",
          disabled ? "opacity-80 pointer-events-none" : "hover:cursor-pointer",
          value
            ? variant === "primary"
              ? "bg-primary/10 border-primary/40 text-primary"
              : "bg-secondary/20 border-secondary/40 text-neutral-20"
            : "bg-neutral-80 border-border text-neutral-20 hover:bg-neutral-80 hover:border-neutral-60",
        )}
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span className="truncate max-w-16 sm:max-w-24 text-sm font-medium">
          {value ? value.name : children}
        </span>
      </div>
      <DropdownContainer
        ref={refs.setFloating}
        style={floatingStyles}
        className={clsx("p-4 w-56 sm:w-60")}
        isOpen={isOpen}
      >
        <div className="flex flex-col">
          <span className="text-base font-semibold text-neutral-20">
            {title}
          </span>

          <Input
            icon={<GoSearch />}
            variant={variant}
            placeholder={placeholder}
            className="my-3"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div
            className={clsx(
              "flex flex-col gap-1.5 max-h-40 overflow-y-auto contain-content scrollbar-hidden",
            )}
          >
            {filteredItems.length === 0 ? (
              <div className="text-center py-4 text-xs text-neutral-40">
                Nenhum resultado encontrado
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  className={clsx(
                    "group flex items-center justify-between hover:cursor-pointer p-2 rounded-lg border transition-all duration-200",
                    isActive(item.id)
                      ? variant === "primary"
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-secondary/20 border-secondary/30 text-neutral-20"
                      : "bg-transparent border-transparent text-neutral-40 hover:bg-neutral-80/40 hover:text-neutral-20",
                  )}
                  onClick={() => setActiveItemId(item.id)}
                  key={item.id}
                >
                  <span className="text-sm">{item.name}</span>
                  <div
                    className={clsx(
                      "w-4 h-4 border rounded-full flex items-center justify-center transition-all duration-200",
                      isActive(item.id)
                        ? variant === "primary"
                          ? "border-primary"
                          : "border-secondary"
                        : "border-border group-hover:border-neutral-40",
                    )}
                  >
                    {isActive(item.id) && (
                      <div
                        className={clsx(
                          "w-2 h-2 rounded-full",
                          variant === "primary" ? "bg-primary" : "bg-secondary",
                        )}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <AnimatedCollapse show={!!activeItemId}>
            <div className="flex flex-col-reverse sm:flex-row items-center gap-2 mt-4">
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
