const MainContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 pb-20 pt-10 px-4 w-full transition-all duration-300">
      <div className="flex flex-col gap-10 max-w-180 mx-auto w-full">
        {children}
      </div>
    </main>
  );
};

export default MainContentContainer;
