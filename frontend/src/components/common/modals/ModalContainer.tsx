import { useEffect } from "react";

const ModalContainer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className="flex items-center justify-center fixed inset-0 bg-black/50">
      <div className="flex flex-col border border-white/10 gap-8 z-55 backdrop-blur-2xl bg-white/10 text-white max-w-[500px] min-w-[300px] rounded-xl p-6 text-center">
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
