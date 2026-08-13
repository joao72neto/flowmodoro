import clsx from "clsx";

import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";

import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import Label from "../../../../shared/components/labels/Label";
import type { SessionDTO } from "../../dtos/sessions-response";

import { memo } from "react";

const BORDER_COLORS: Record<number, string> = {
  10: "border-l-danger",
  20: "border-l-primary",
  30: "border-l-success",
};

const FOCUS_CLASSES = clsx(
  "shrink-0 whitespace-nowrap text-sm bg-neutral-80/50 border border-border",
  "px-2 py-0.5 rounded-md shadow flex items-center h-fit ml-auto self-center",
);

const Session = memo(
  ({
    session,
    onClick,
  }: {
    session: SessionDTO;
    onClick?: (id: string) => void;
  }) => {
    const ratioKey = Math.round(session.ratio * 100);
    const borderColorClass = BORDER_COLORS[ratioKey];

    const showTagAndProject =
      session.tag.id !== "" || session.project.id !== "";

    return (
      <div onClick={() => onClick?.(session.id)} className="w-full">
        <div
          className={clsx(
            "flex gap-2 relative overflow-hidden",
            "border shadow-lg border-border py-3 px-4 sm:py-4 sm:px-5 cursor-pointer rounded-xl w-full",
            "hover:bg-neutral-80/40 hover:translate-x-0.5 transition duration-200 bg-neutral-80/60",
            "border-l-4",
            borderColorClass,
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex justify-between w-full items-center sm:w-auto sm:flex-1 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex-1 text-sm text-left sm:text-base line-clamp-1 break-all">
                  {capitalize(session.name)}
                </span>
              </div>
            </div>

            {showTagAndProject && (
              <div className="flex items-center gap-2 min-w-0 sm:flex-1">
                {session.project?.name && (
                  <Label icon={<GoProject />}>{session.project.name}</Label>
                )}
                {session.tag?.name && (
                  <Label variant="secondary" icon={<IoMdPricetag />}>
                    {session.tag.name}
                  </Label>
                )}
              </div>
            )}
          </div>
          <span className={FOCUS_CLASSES}>{formatToHour(session.focus)}</span>
        </div>
      </div>
    );
  },
);

Session.displayName = "Session";

export default Session;
