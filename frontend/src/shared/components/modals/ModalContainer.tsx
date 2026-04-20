import clsx from "clsx";
import { useEffect } from "react";

const ModalContainer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className="flex items-center justify-center fixed inset-0 bg-black/50 z-50">
      <div
        className={clsx(
          "flex flex-col border border-white/10 gap-8 backdrop-blur-2xl mx-6",
          "bg-white/10 text-white max-w-[500px] min-w-[280px] ",
          "rounded-xl p-6 text-center",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
