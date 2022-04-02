import { Box, Card, Collapse, Stack, Typography } from "@mui/material";
import { Donut } from "components";
import { colorMap } from "constants";
import { FilteredIncomes } from "context";
import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { calculateRate } from "utils";

export default function IncomeInfo() {
  const currency = useSelector(state => state.wallet.baseCurrency.currency);
  const [incomes] = useContext(FilteredIncomes);

  const shouldRender = incomes.length > 0;

  const total = useMemo(
    () => incomes.reduce((acc, curr) => acc + calculateRate(curr), 0),
    [incomes]
  );

  const tags = useMemo(
    () =>
      incomes.reduce((acc, curr) => {
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
      }, {}),
    [incomes, total]
  );

  let tagsArray = useMemo(() => Object.entries(tags), [tags]);

  tagsArray = useMemo(
    () => tagsArray.sort((a, b) => b[1].percentage - a[1].percentage),
    [tagsArray]
  );

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
    <Collapse in={shouldRender}>
      <Box sx={{ px: 2 }}>
        <Card>
          <Typography my={1} ml={2} variant="h6">
            Your income sources
          </Typography>

          <Box sx={{ bgcolor: "background.default", height: 2 }} />

          <Stack p={2} direction="row">
            <Donut data={tagsArray} height="7rem" />

            <Stack
              spacing={0.5}
              alignItems="stretch"
              justifyContent={tagsArray.length > 3 ? "center" : "flex-start"}
              sx={{ alignSelf: "stretch", ml: 2, flexGrow: 1, py: 0.5 }}
            >
              {tagsArray.slice(0, 5).map(([tag, { percentage, amount }]) => (
                <Stack key={tag} direction="row" justifyContent="space-between">
                  <Stack direction="row" alignItems="center">
                    <Box sx={dotStyle(tag)} />
                    <Typography variant="body2">
                      {tag}: {Math.round(percentage) || percentage.toFixed(1)}%
                    </Typography>
                  </Stack>
                  <Typography textAlign="right" variant="body2">
                    {amount.toFixed(2)} {currency}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Card>
      </Box>
    </Collapse>
  );
}
