import clsx from "clsx";
import DropdownContainer from "../../../../shared/components/Dropdown/DropdownContainer";
import { useEffect, useRef, useState, memo } from "react";
import { useClickOutside } from "../../../../shared/hooks/useClickOutside";
import Input from "../../../../shared/components/inputs/Input";
import { GoSearch } from "react-icons/go";

import Button from "../../../../shared/components/buttons/Button/Button";
import { AnimatedCollapse } from "../../../../shared/components/AnimatedCollapse";
import type { ProjectDTO } from "../../../projects/dtos/projects-response";
import type { TagDTO } from "../../../tags/dtos/tags-response";

import { getStableProjectColor } from "../../../projects/consts/project-colors";

const SessionSelector = <T extends ProjectDTO | TagDTO>({
  children,
  title = "Title",
  icon,
  items = [],
  variant = "primary",
  placeholder = "Pesquise aqui...",
  emptyMsg = "Nenhum item encontrado",
  value,
  onChange,
  disabled = false,
  align = "auto",
}: {
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  items?: T[];
  variant?: "primary" | "secondary";
  placeholder?: string;
  emptyMsg?: string;
  value: T | null;
  onChange: (item: T | null) => void;
  disabled?: boolean;
  align?: "left" | "right" | "auto";
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [activeItemId, setActiveItemId] = useState(value?.id || "");
  const [searchQuery, setSearchQuery] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const valueColor =
    value && "totalFocus" in value
      ? getStableProjectColor(value.id, (value as ProjectDTO).color)
      : undefined;

  useEffect(() => {
    setActiveItemId(value?.id || "");
  }, [value]);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
    setSearchQuery("");
  });

  const isActive = (id: string) => id === activeItemId;

  const handleConfirmItem = () => {
    const item = items.find((item) => item.id === activeItemId) || null;

    onChange(item);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClearItem = () => {
    onChange(null);
    setActiveItemId("");
    setSearchQuery("");
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={clsx(
          "flex items-center gap-2 border p-2 rounded-lg transition-all duration-200",
          "bg-neutral-80 border-border text-neutral-20 hover:bg-neutral-80/20",
          disabled ? "opacity-80 pointer-events-none" : "hover:cursor-pointer",
          value &&
            variant === "secondary" &&
            "bg-secondary/15! border-secondary/40! text-neutral-20!",
        )}
        style={
          value && valueColor
            ? {
                backgroundColor: `${valueColor}1a`,
                borderColor: `${valueColor}40`,
                color: valueColor,
              }
            : undefined
        }
      >
        {icon && <span className="text-lg">{icon}</span>}

        <span className="truncate max-w-16 sm:max-w-24 text-sm font-medium">
          {value ? value.name : children}
        </span>
      </div>

      <DropdownContainer
        className={clsx("p-4 w-56 sm:w-60")}
        isOpen={isOpen}
        align={align}
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
                {emptyMsg}
              </div>
            ) : (
              filteredItems.map((item) => {
                const itemColor =
                  "totalFocus" in item
                    ? getStableProjectColor(item.id, (item as ProjectDTO).color)
                    : undefined;
                const active = isActive(item.id);

                return (
                  <div
                    className={clsx(
                      "group flex items-center justify-between hover:cursor-pointer p-2 rounded-lg border",
                      "bg-transparent border-transparent duration-200 hover:border-border",
                      "text-neutral-40 hover:bg-neutral-60/20 hover:text-neutral-20",
                      active && variant === "secondary"
                        ? "bg-secondary/15! border-secondary/40! text-neutral-20"
                        : undefined,
                    )}
                    style={
                      active && itemColor && variant === "primary"
                        ? {
                            backgroundColor: `${itemColor}1a`,
                            borderColor: `${itemColor}30`,
                            color: itemColor,
                          }
                        : undefined
                    }
                    onClick={() => setActiveItemId(item.id)}
                    key={item.id}
                  >
                    <span className="text-sm">{item.name}</span>

                    <div
                      className={clsx(
                        "w-4 h-4 border rounded-full flex items-center justify-center transition-all duration-200",
                        "border-border group-hover:border-secondary",
                        active && variant === "secondary" && "border-secondary",
                      )}
                      style={
                        active && itemColor && variant === "primary"
                          ? { borderColor: itemColor }
                          : undefined
                      }
                    >
                      {active && (
                        <div
                          className={"w-2 h-2 rounded-full bg-secondary"}
                          style={
                            itemColor && variant === "primary"
                              ? { backgroundColor: itemColor }
                              : undefined
                          }
                        />
                      )}
                    </div>
                  </div>
                );
              })
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

SessionSelector.displayName = "SessionSelector";

export default memo(SessionSelector) as typeof SessionSelector;
