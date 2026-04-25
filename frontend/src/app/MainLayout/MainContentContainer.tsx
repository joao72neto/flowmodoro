const MainContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col flex-1 py-20 px-4 w-full transition-all duration-300">
      <div className="flex flex-col flex-1 gap-10 max-w-180 mx-auto w-full">
        {children}
      </div>
    </main>
  );
};

export default MainContentContainer;
