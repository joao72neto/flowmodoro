const ModalContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center absolute inset-0 overflow-hidden">
      <div className="bg-black absolute inset-0 opacity-50 z-50"></div>
      {children}
    </div>
  );
};

export default ModalContainer;
