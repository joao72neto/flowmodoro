import clsx from "clsx";

import { formatToHour } from "../../../../shared/utils/number.utils";
import { capitalize } from "../../../../shared/utils/string.utils";
import { PRESETS } from "../../../timer/consts/ratio-presets";

import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import Label from "../../../../shared/components/labels/Label";
import type { SessionDTO } from "../../dtos/sessions-response";

const Session = ({
  session,
  onClick,
}: {
  session: SessionDTO;
  onClick?: () => void;
}) => {
  const preset = PRESETS.find((preset) => preset.value === session.ratio * 100);

  const showTagAndProject = session.tag.id !== "" || session.project.id !== "";

  const focusClasses = clsx(
    "shrink-0 whitespace-nowrap text-sm bg-neutral-80/50 border border-border",
    "px-2 py-0.5 rounded-md shadow flex items-center",
  );

  return (
    <div onClick={onClick} className="w-full">
      <div
        className={clsx(
          "flex gap-2 relative overflow-hidden",
          "border shadow-lg border-border py-3 px-4 sm:py-4 sm:px-5 cursor-pointer rounded-xl w-full",
          "hover:bg-neutral-80/40 hover:translate-x-0.5 transition duration-200 bg-neutral-80/60",
          "border-l-4",
          preset?.value === 10 && "border-l-danger",
          preset?.value === 20 && "border-l-primary",
          preset?.value === 30 && "border-l-success",
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
        <span className={clsx(focusClasses, "h-fit ml-auto self-center")}>
          {formatToHour(session.focus)}
        </span>
      </div>
    </div>
  );
};

export default Session;
