import clsx from "clsx";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";

interface PageSelectorProps {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  goToEndPage: () => void;
  goToStartPage: () => void;
}

const PageSelector = ({
  currentPage,
  totalPages,
  goToEndPage,
  goToStartPage,
  goToPage,
}: PageSelectorProps) => {
  if (totalPages <= 1) return null;

  const maxVisiblePages = 4;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = startPage + maxVisiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={goToStartPage}
        disabled={currentPage === 1}
        className={clsx(
          "group px-3 py-1 cursor-pointer",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        title="Primeira página"
      >
        <FiChevronsLeft
          size={30}
          className={clsx(
            "block origin-center transition-all duration-300 ease-out",
            "group-hover:scale-110 group-hover:-translate-x-1",
            "group-active:scale-95 group-active:translate-x-0",
          )}
        />
      </button>

      <div className="flex gap-2 sm:flex">
        {pages.map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => goToPage(page)}
            className={clsx(
              "px-4 py-1 rounded-md text-sm font-medium transition-colors text-neutral-10",
              "border-border cursor-pointer",
              currentPage === page
                ? "bg-primary/20 border border-primary/50 text-neutral-10"
                : "border hover:bg-neutral-60/50",
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={goToEndPage}
        disabled={currentPage === totalPages}
        className={clsx(
          "group px-3 py-1 cursor-pointer",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        title="Última página"
      >
        <FiChevronsRight
          size={30}
          className={clsx(
            "block origin-center transition-all duration-300 ease-out",
            "group-hover:scale-110 group-hover:translate-x-1",
            "group-active:scale-95 group-active:translate-x-0",
          )}
        />
      </button>
    </div>
  );
};

export default PageSelector;
