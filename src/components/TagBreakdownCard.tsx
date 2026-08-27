import { Box, Card, Collapse, Stack, Typography } from "@mui/material";
import { colorMap } from "constants";
import { useTagBreakdown } from "hooks";
import { useSelector } from "react-redux";
import { Tag, TransactionWithId } from "types";
import { formatLongNumber } from "utils";
import Donut from "./Donut";

interface TagBreakdownCardProps {
  title: string;
  transactions: TransactionWithId[];
}

function dotStyle(tag: Tag) {
  return {
    width: "0.625rem",
    height: "0.625rem",
    mr: 1.5,
    borderRadius: 4,
    bgcolor: colorMap[tag],
  };
}

// Shared by ExpenseInfo and IncomeInfo, which were previously two
// near-identical ~100-line copies of this same card differing only in the
// title and which context they read transactions from.
export default function TagBreakdownCard({
  title,
  transactions,
}: TagBreakdownCardProps) {
  const currency = useSelector(state => state.wallet.baseCurrency.currency);
  const tagsArray = useTagBreakdown(transactions);
  const shouldRender = transactions.length > 0;

  return (
    <Collapse unmountOnExit in={shouldRender}>
      <Box sx={{ px: 2 }}>
        <Card>
          <Typography my={1} ml={2} variant="h6">
            {title}
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
