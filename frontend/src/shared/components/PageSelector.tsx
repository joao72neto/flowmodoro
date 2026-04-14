import clsx from "clsx";
import { RxCaretLeft } from "react-icons/rx";
import { RxCaretRight } from "react-icons/rx";

interface PageSelectorProps {
  currentPage: number;
  totalPages: number;
  prevPage: () => void;
  nextPage: () => void;
  goToPage: (page: number) => void;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

const PageSelector = ({
  currentPage,
  totalPages,
  prevPage,
  nextPage,
  goToPage,
  hasPrevPage,
  hasNextPage,
}: PageSelectorProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={prevPage}
        disabled={!hasPrevPage}
        className={clsx(
          "group px-3 py-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        title="Primeira página"
      >
        <RxCaretLeft
          size={30}
          className={clsx(
            "block origin-center transition-all duration-300 ease-out",
            "group-hover:scale-110 group-hover:-translate-x-1",
            "group-active:scale-95 group-active:translate-x-0",
          )}
        />
      </button>

      <div className="flex gap-1 sm:flex">
        {getPageNumbers().map((page) => (
          <button
            type="button"
            key={page}
            onClick={() => goToPage(page)}
            className={clsx(
              "px-3 py-1 rounded-md text-sm font-medium transition-colors text-white",
              "border-neutral-600 cursor-pointer",
              currentPage === page
                ? "bg-danger-2"
                : "border hover:bg-gray-600/20",
            )}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={nextPage}
        disabled={!hasNextPage}
        className={clsx(
          "group px-3 py-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        title="Última página"
      >
        <RxCaretRight
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
