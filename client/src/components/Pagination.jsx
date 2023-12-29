import React from "react";

const Pagination = (props) => {
  //   currentPage, totalPages, goToPageFunction;
  const currentPage = props.page;
  const totalPages = props.pageCount;
  const goToPageFunction = props.goToPageFunc;
  const renderPageButtons = () => {
    const buttons = [];

    if (totalPages <= 5) {
      // Render all buttons if there are 5 or fewer pages
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => goToPageFunction(i)}
            className={i === currentPage ? "active" : ""}
          >
            {i}
          </button>
        );
      }
    } else {
      // Render buttons with ellipsis for more than 5 pages
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + 4);

      if (start > 1) {
        buttons.push(
          <button key={1} onClick={() => goToPageFunction(1)}>
            1
          </button>
        );
        buttons.push(<span key="ellipsis1">...</span>);
      }

      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => goToPageFunction(i)}
            className={i === currentPage ? "active" : ""}
          >
            {i}
          </button>
        );
      }

      if (end < totalPages) {
        buttons.push(<span key="ellipsis2">...</span>);
        buttons.push(
          <button key={totalPages} onClick={() => goToPageFunction(totalPages)}>
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };

  return (
    <div className="pagination">
      <button onClick={() => goToPageFunction(1)} disabled={currentPage === 1}>
        {"<<"}
      </button>
      <button
        onClick={() => goToPageFunction(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>
      {renderPageButtons()}
      <button
        onClick={() => goToPageFunction(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
      <button
        onClick={() => goToPageFunction(totalPages)}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
