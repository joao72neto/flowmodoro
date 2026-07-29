import clsx from "clsx";

const MainContentContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      className={clsx(
        "flex flex-col justify-center flex-1 pb-10 pt-5 px-4 w-full transition-all duration-300",
        "mb-[58px]",
      )}
    >
      <div className="flex flex-col gap-10 max-w-180 mx-auto w-full">
        {children}
      </div>
    </main>
  );
};

export default MainContentContainer;
