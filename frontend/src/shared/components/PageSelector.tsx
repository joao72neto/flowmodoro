const PageSelector = ({
  currentPage,
  totalPages,
  prevPage,
  nextPage,
}: {
  currentPage: number;
  totalPages: number;
  prevPage: () => void;
  nextPage: () => void;
}) => {
  return (
    <div className="flex gap-3">
      <button onClick={prevPage}>Prev</button>
      <span>
        {currentPage} / {totalPages}
      </span>
      <button onClick={nextPage}>Next</button>
    </div>
  );
};

export default PageSelector;
