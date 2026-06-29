import { useCallback } from "react";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export function usePagination({
  itemsPerPage,
  totalItems,
  currentPage,
  setCurrentPage,
}: UsePaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages || 1));
      setCurrentPage(validPage);
    },
    [totalPages],
  );

  return {
    currentPage,
    totalPages,
    goToPage,
  };
}
