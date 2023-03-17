import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { faFile } from "@fortawesome/free-solid-svg-icons/faFile";
import { faPrayingHands } from "@fortawesome/free-solid-svg-icons/faPrayingHands";
import TimelineDot from "@mui/lab/TimelineDot";
import Tooltip from "@mui/material/Tooltip";
import type { TimelineType } from "@prisma/client";
import React from "react";
import FontAwesomeSvgIcon from "./FontAwesomeSvgIcon";

const TimelineIcon: React.FC<{
  type: TimelineType;
}> = ({ type }) => {
  switch (type) {
    case "PRAYED":
      return (
        <Tooltip title="Prayed">
          <TimelineDot
            sx={{
              bgcolor: "transparent",
            }}
          >
            <FontAwesomeSvgIcon icon={faPrayingHands} color="info" />
          </TimelineDot>
        </Tooltip>
      );
    case "NOTE":
      return (
        <Tooltip title="Note">
          <TimelineDot
            sx={{
              bgcolor: "transparent",
            }}
          >
            <FontAwesomeSvgIcon icon={faFile} />
          </TimelineDot>
        </Tooltip>
      );
    case "ACCOMPLISHED":
      return (
        <Tooltip title="Prayer accomplished">
          <TimelineDot
            sx={{
              bgcolor: "transparent",
            }}
          >
            <FontAwesomeSvgIcon icon={faCircleCheck} color="success" />
          </TimelineDot>
        </Tooltip>
      );
  }
};

export default TimelineIcon;
