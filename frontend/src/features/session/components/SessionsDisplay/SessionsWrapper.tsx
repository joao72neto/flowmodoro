const SessionsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-6 px-4 min-w-[300px] w-full">
      <h1 className="text-2xl border-b-2 border-b-white/10 py-2 text-center">
        Sessões
      </h1>
      {children}
    </div>
  );
};

export default SessionsWrapper;
