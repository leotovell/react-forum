import React from "react";

function PageButtons(props) {
  let page = props.page;
  if (page == 0 || page < 0) {
    page = 1;
  }
  const onClickFunc = props.onClick;
  const postCount = props.postCount;
  return (
    <div>
      {/* If page == 1: then have page +1, page +2, ..., end_page... */}
      {page == 1 ? (
        <div>
          <button disabled>{"<<"}</button>
          <button disabled>{page}</button>
          <button onClick={(e) => onClickFunc(page + 1)}>{page + 1}</button>
          <button onClick={(e) => onClickFunc(page + 2)}>{page + 2}</button>
          <span>...</span>
          <button onClick={(e) => onClickFunc(postCount)}>{postCount}</button>
        </div>
      ) : page == 2 ? (
        <div></div>
      ) : page == 3 ? (
        <div></div>
      ) : page - 2 > 1 ? (
        <div></div>
      ) : page + 1 > postCount ? (
        <div></div>
      ) : page == postCount ? (
        <div></div>
      ) : (
        <div>ERROR</div>
      )}
    </div>
  );
}

export default PageButtons;
