const SessionsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-6 min-w-[300px] w-full">{children}</div>
  );
};

export default SessionsWrapper;
