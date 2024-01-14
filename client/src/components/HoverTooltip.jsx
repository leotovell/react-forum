import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const HoverTooltip = ({ id, children, title, placement }) => {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip id={id}>{title}</Tooltip>}
    >
      <button
        style={{ all: "unset", color: "grey", cursor: "help" }}
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </button>
    </OverlayTrigger>
  );
};

HoverTooltip.defaultProps = {
  placement: "top",
};

export default HoverTooltip;
