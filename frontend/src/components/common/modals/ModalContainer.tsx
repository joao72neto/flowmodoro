const ModalContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center absolute inset-0 overflow-hidden">
      <div className="bg-black absolute inset-0 opacity-50 z-50"></div>
      <div className="flex flex-col border border-white/10 gap-8 z-55 backdrop-blur-2xl bg-white/10 text-white max-w-[500px] min-w-[300px] rounded-xl p-6 text-center">
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
