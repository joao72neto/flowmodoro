import clsx from "clsx";

import { formatToHour } from "../../../../shared/utils/number.utils";
import { PRESETS } from "../../../timer/consts/ratio-presets";

import { GoProject } from "react-icons/go";
import { IoMdPricetag } from "react-icons/io";
import Label from "../../../../shared/components/labels/Label";
import type { SessionDTO } from "../../offline/session.dtos";

const Session = ({
  session,
  onClick,
}: {
  session: SessionDTO;
  onClick?: () => void;
}) => {
  const preset = PRESETS.find((preset) => preset.value === session.ratio * 100);

  const showTagAndProject = session.tag || session.project;

  return (
    <div onClick={onClick} className="w-full">
      <div
        className={clsx(
          "flex flex-col sm:flex-row sm:items-center gap-2",
          "border shadow-lg border-border p-3 sm:p-4 cursor-pointer rounded-xl w-full",
          "hover:bg-neutral-80/20 transition duration-200 bg-neutral-80/60",
        )}
      >
        <div className="flex justify-between w-full items-center">
          <span className={"flex-1 text-sm text-left sm:text-base"}>
            {session.name}
          </span>

          {!showTagAndProject && (
            <span
              className={clsx(
                "text-sm bg-neutral-80/50 border border-border",
                "px-2 py-0.5 rounded-md shadow",
                preset?.textClass,
              )}
            >
              {formatToHour(session.focus)}
            </span>
          )}
        </div>

        {showTagAndProject && (
          <div className="flex justify-between w-full sm:w-auto sm:gap-6">
            <div className="flex items-center gap-2">
              {session.project?.name && (
                <Label icon={<GoProject />}>{session.project.name}</Label>
              )}
              {session.tag?.name && (
                <Label variant="secondary" icon={<IoMdPricetag />}>
                  {session.tag.name}
                </Label>
              )}
            </div>
            <span
              className={clsx(
                "text-sm bg-neutral-80/50 border border-border",
                "px-2 py-0.5 rounded-md shadow",
                preset?.textClass,
              )}
            >
              {formatToHour(session.focus)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Session;
