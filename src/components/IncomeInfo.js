import { Box, Card, Stack, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import calculateRate from "../utils/calculateRate";
import Donut from "./Donut";

export const colorMap = {
  Salary: "#f44336",
  Savings: "#ff9800",
  Investments: "#ffeb3b",
  Gift: "#4caf50",
  Prize: "#2196f3",
  Sale: "#3f51b5",
  Other: "#f4f4f4",
};

export default function IncomeInfo() {
  const incomes = useSelector(state => state.wallet.incomes);

  if (incomes.length === 0) return null;

  const total = incomes.reduce((acc, curr) => acc + calculateRate(curr), 0);
  const tags = incomes.reduce((acc, curr) => {
    const { tag } = curr;
    const amount = calculateRate(curr);
    const percentage = (amount / total) * 100;
    if (acc[tag] !== undefined)
      acc[tag] = {
        percentage: percentage + acc[tag].percentage,
        amount: amount + acc[tag].amount,
      };
    else acc[tag] = { percentage, amount };
    return acc;
  }, {});

  const tagsArray = Object.entries(tags);
  tagsArray.sort((a, b) => b[1].percentage - a[1].percentage);
  console.log(tagsArray);

  function dotStyle(tag) {
    return {
      width: "0.625rem",
      height: "0.625rem",
      mr: 1.5,
      borderRadius: 4,
      bgcolor: colorMap[tag],
    };
  }

  return (
    <Box sx={{ px: 2 }}>
      <Typography mb={1} ml={1.5} variant="h6">
        Your income sources
      </Typography>
      <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Donut data={tagsArray} colorMap={colorMap} height="7rem" />
        <Stack
          spacing={0.5}
          alignItems="stretch"
          justifyContent={tagsArray.length > 3 ? "center" : "flex-start"}
          sx={{ alignSelf: "stretch", ml: 2, flexGrow: 1, py: 0.5 }}
        >
          {tagsArray.slice(0, 5).map(([tag, { percentage, amount }]) => (
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="row" alignItems="center">
                <Box sx={dotStyle(tag)} />
                <Typography variant="body2">
                  {tag}: {Math.round(percentage)}%
                </Typography>
              </Stack>
              <Typography textAlign="right" variant="body2">{amount.toFixed(2)} BRL</Typography>
            </Stack>
          ))}
        </Stack>
      </Card>
    </Box>
  );
}
