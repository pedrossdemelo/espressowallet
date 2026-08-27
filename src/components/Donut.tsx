import { Box, Tooltip } from "@mui/material";
import { colorMap } from "constants";
import React from "react";
import { Tag } from "types";

interface DonutProps {
  height?: number | string;
  sx?: Record<string, unknown>;
  data: [Tag, { percentage: number; amount: number }][];
}

// Circumference of the r=9.5 circle used below (2 * 3.1416 * 9.5).
const CIRCUMFERENCE = 3.1416 * 19;

export default function Donut(props: DonutProps) {
  const { height = 200, sx, data } = props;

  let percentageLeft = 100;

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
              // Firefox doesn't evaluate calc() inside SVG presentation
              // attributes (only Chrome/Safari do) — compute the dash length
              // here instead so this renders the same everywhere.
              strokeDasharray={`${
                ((percentageLeft + percentage) * CIRCUMFERENCE) / 100
              } ${CIRCUMFERENCE}`}
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
