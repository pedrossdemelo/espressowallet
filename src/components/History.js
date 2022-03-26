import { Box, Collapse, List, Typography } from "@mui/material";
import { TransactionListItem } from "components";
import { useFilteredTransactions } from "hooks";
import { TransitionGroup } from "react-transition-group";

export default function History() {
  const [transactions] = useFilteredTransactions();

  if (!transactions.length) return null;

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexFlow: "column nowrap" }}>
      <Typography mb={1} ml={3.5} variant="h6">
        History
      </Typography>

      <List
        sx={{
          pt: 1.5,
          bgcolor: "background.paper",
          borderRadius: "1rem 1rem 0 0",
          boxShadow: 2,
          flexGrow: 1,
          pb: "calc(56px + 1.375rem)",
        }}
      >
        <TransitionGroup>
          {transactions.map(transaction => (
            <Collapse key={transaction.id}>
              <TransactionListItem transaction={transaction} />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </Box>
  );
}
