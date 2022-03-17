import { Box, Tooltip } from "@mui/material";
import React from "react";
import { colorMap } from "./History";

export default function Donut(props) {
  const { height = 200, sx, data } = props;

  let percentageLeft = 100;

  // TODO: This donut approach doesn't work on Firefox. Fix it.

  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height={height}
      width={height}
      {...sx}
    >
      {data.map(([tag, { percentage }], i) => {
        percentageLeft -= percentage;
        return (
          <Tooltip
            key={tag}
            placement="top"
            arrow
            title={`${tag}: ${percentage.toFixed(2)}%`}
          >
            <Box
              sx={{ zIndex: 20 - i, position: "relative" }}
              component="circle"
              r="9.5"
              cx="12"
              cy="12"
              fill="transparent"
              stroke={colorMap[tag]}
              strokeWidth="5"
              shapeRendering="optimizeSpeed"
              strokeDasharray={`calc(${
                percentageLeft + percentage
              } * (3.1416 * 19)/100) calc(3.1416 * 19)`}
            />
          </Tooltip>
        );
      })}
      <Box
        component="circle"
        r="9.5"
        cx="12"
        cy="12"
        fill="transparent"
        strokeWidth="5"
        shapeRendering="optimizeSpeed"
      />
    </Box>
  );
}
