import { Box, Card, Collapse, Stack, Typography } from "@mui/material";
import { colorMap } from "constants";
import { FilteredExpenses } from "context";
import { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { Tag } from "types";
import { calculateRate, formatLongNumber } from "utils";
import Donut from "./Donut";

interface TagSummary {
  percentage: number;
  amount: number;
}

export default function ExpenseInfo() {
  const currency = useSelector(state => state.wallet.baseCurrency.currency);
  const [expenses] = useContext(FilteredExpenses);

  const total = useMemo(
    () => expenses.reduce((acc, curr) => acc + calculateRate(curr), 0),
    [expenses],
  );

  const tags = useMemo(
    () =>
      expenses.reduce<Partial<Record<Tag, TagSummary>>>((acc, curr) => {
        const { tag } = curr;
        const amount = calculateRate(curr);
        const percentage = (amount / total) * 100;
        const existing = acc[tag];
        if (existing !== undefined)
          acc[tag] = {
            percentage: percentage + existing.percentage,
            amount: amount + existing.amount,
          };
        else acc[tag] = { percentage, amount };
        return acc;
      }, {}),
    [expenses, total],
  );

  let tagsArray = useMemo(
    // Object.entries widens keys to `string` — cast back to Tag, which is
    // what every key actually is here (see the reduce above).
    () => Object.entries(tags) as [Tag, TagSummary][],
    [tags],
  );

  tagsArray = useMemo(
    () => tagsArray.sort((a, b) => b[1].percentage - a[1].percentage),
    [tagsArray],
  );

  const shouldRender = expenses.length > 0;

  function dotStyle(tag: Tag) {
    return {
      width: "0.625rem",
      height: "0.625rem",
      mr: 1.5,
      borderRadius: 4,
      bgcolor: colorMap[tag],
    };
  }

  return (
    <Collapse unmountOnExit in={shouldRender}>
      <Box sx={{ px: 2 }}>
        <Card>
          <Typography my={1} ml={2} variant="h6">
            Your expense sources
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
                    {formatLongNumber(amount)} {currency}
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
