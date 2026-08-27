import { Box, Card, Collapse, List, Typography } from "@mui/material";
import { TransactionListItem } from "components";
import { useFilteredTransactions } from "hooks";
import { TransitionGroup } from "react-transition-group";

export default function History() {
  const [transactions] = useFilteredTransactions();

  if (!transactions.length) return null;

  return (
    <Box
      sx={theme => ({
        flexGrow: 1,
        display: "flex",
        flexFlow: "column nowrap",
        [theme.breakpoints.up("sm")]: {
          px: 2,
        },
      })}
    >
      <Card
        sx={{
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          flexGrow: 1,
          borderBottomRightRadius: 0,
          overflow: "visible",
        }}
      >
        <Typography
          my={1}
          sx={theme => ({ ml: 3.5, [theme.breakpoints.up("sm")]: { ml: 2 } })}
          variant="h6"
        >
          History
        </Typography>

        <Box sx={{ bgcolor: "background.default", height: 2 }} />

        <List
          sx={{
            overflow: "visible",
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
      </Card>
    </Box>
  );
}
