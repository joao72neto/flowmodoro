import ExpandableButton from "../../shared/components/buttons/ExpandableButton";
import { PiCaretLeftBold } from "react-icons/pi";
import BackupMenu from "./BackupMenu";
import clsx from "clsx";

const Footer = ({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
}) => {
  return (
    <footer className="flex p-3 justify-between border-t border-border items-center">
      <BackupMenu />

      <div
        className={clsx(
          "fixed bottom-3 left-[50%] translate-x-[-50%] flex flex-col gap-1",
          "items-center justify-self-center text-xs",
        )}
      >
        <p>João Salvador Neto</p>
        <p>© {new Date().getFullYear()} </p>
      </div>

      <ExpandableButton
        icon={
          <PiCaretLeftBold
            size={25}
            className="transition duration-200 hover:-translate-x-1"
          />
        }
        className="rounded-full!"
        onClick={() => setIsSidebarOpen(true)}
      >
        Projetos e Tags
      </ExpandableButton>
    </footer>
  );
};

export default Footer;
