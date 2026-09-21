import clsx from "clsx";
import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import type { SessionSuggestionDTO } from "../../dtos/sessions-response";
import { getStableProjectColor } from "../../../projects/consts/project-colors";

interface SessionAutocompleteProps {
  suggestions: SessionSuggestionDTO[];
  onSelect: (suggestion: SessionSuggestionDTO) => void;
}

const SessionAutocomplete = ({
  suggestions,
  onSelect,
}: SessionAutocompleteProps) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className={clsx(
        "absolute top-[105%] sm:top-[110%] left-0 right-0 z-20 w-full",
        "bg-neutral-80/95 backdrop-blur-md border border-border rounded-xl shadow-xl",
        "py-2 max-h-[320px] overflow-y-auto divide-y divide-border/40",
      )}
    >
      {suggestions.map((item) => {
        const projectColor = item.project
          ? getStableProjectColor(item.project.id, item.project.color)
          : undefined;

        return (
          <div
            key={item.id}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(item);
            }}
            className={clsx(
              "px-4 py-2.5 flex items-center justify-between cursor-pointer gap-2",
              "hover:bg-neutral-70/60 transition-colors duration-150 group",
            )}
          >
            <span className="font-medium text-neutral-10 truncate text-sm sm:text-base flex-1">
              {item.name}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              {item.project && (
                <span
                  className={clsx(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded-md",
                    "border font-medium max-w-[140px] truncate",
                  )}
                  style={{
                    backgroundColor: `${projectColor}1a`,
                    borderColor: `${projectColor}40`,
                    color: projectColor,
                  }}
                >
                  <GoProject className="text-xs shrink-0" />
                  <span className="truncate">{item.project.name}</span>
                </span>
              )}

              {item.tag && (
                <span
                  className={clsx(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border",
                    "font-medium bg-secondary/15 border-secondary/40",
                    "text-neutral-20 max-w-[120px] truncate",
                  )}
                >
                  <IoMdPricetag className="text-xs shrink-0" />
                  <span className="truncate">{item.tag.name}</span>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SessionAutocomplete;
