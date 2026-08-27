import { useMemo } from "react";
import { Tag, TransactionWithId } from "types";
import { calculateRate } from "utils";

export interface TagSummary {
  percentage: number;
  amount: number;
}

// Groups transactions by tag: each tag's share of the total and its
// absolute amount, sorted with the largest share first. Shared by
// ExpenseInfo/IncomeInfo via TagBreakdownCard.
export default function useTagBreakdown(
  transactions: TransactionWithId[]
): [Tag, TagSummary][] {
  const total = useMemo(
    () => transactions.reduce((acc, curr) => acc + calculateRate(curr), 0),
    [transactions]
  );

  const tags = useMemo(
    () =>
      transactions.reduce<Partial<Record<Tag, TagSummary>>>((acc, curr) => {
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
    [transactions, total]
  );

  return useMemo(
    // Object.entries widens keys to `string` — cast back to Tag, which is
    // what every key actually is here (see the reduce above).
    () =>
      (Object.entries(tags) as [Tag, TagSummary][]).sort(
        (a, b) => b[1].percentage - a[1].percentage
      ),
    [tags]
  );
}
