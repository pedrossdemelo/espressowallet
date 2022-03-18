import {
  AttachMoney,
  CardGiftcard,
  Checkroom,
  DevicesOther,
  DirectionsCar,
  EmojiEvents,
  House,
  LocalHospital,
  MoreHoriz,
  Payments,
  Restaurant,
  Savings,
  School,
  Sell,
  TheaterComedy,
  TrendingUp,
  Work,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

export const iconsMap = {
  Entertainment: <TheaterComedy />,
  Food: <Restaurant />,
  Health: <LocalHospital />,
  Education: <School />,
  Transportation: <DirectionsCar />,
  Savings: <Savings />,
  Payment: <Payments />,
  Clothing: <Checkroom />,
  Household: <House />,
  Eletronics: <DevicesOther />,
  Work: <Work />,
  Salary: <AttachMoney />,
  Investments: <TrendingUp />,
  Gift: <CardGiftcard />,
  Prize: <EmojiEvents />,
  Sale: <Sell />,
  Other: <MoreHoriz />,
};

export const colorMap = {
  Investments: "#22c55e",
  Payment: "#fbbf24",
  Food: "#fb923c",
  Work: "#3b82f6",
  Education: "#7dd3fc",
  Entertainment: "#ec4899",
  Transportation: "#6366f1",
  Eletronics: "#a3e635",
  Health: "#dc2626",
  Clothing: "#f43f5e",
  Household: "#a855f7",
  Other: "#d4d4d4",
  Salary: "#047857",
  Savings: "#2dd4bf",
  Gift: "#f87171",
  Prize: "#2196f3",
  Sale: "#d946ef",
};

export default function History() {
  const expenses = useSelector(state => state.wallet.expenses);
  const incomes = useSelector(state => state.wallet.incomes);

  if (expenses.length === 0 && incomes.length === 0) {
    return null;
  }

  const combinedTransactions = [...expenses, ...incomes];

  combinedTransactions.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexFlow: "column nowrap" }}>
      <Typography mb={1} ml={3.5} variant="h6">
        History
      </Typography>
      <List
        sx={{
          bgcolor: "background.paper",
          borderRadius: "1rem 1rem 0 0",
          boxShadow: 2,
          flexGrow: 1,
        }}
      >
        {combinedTransactions.map(transaction => (
          <ListItemButton key={transaction.description}>
            <Stack
              direction="row"
              sx={{ flexGrow: 1 }}
              justifyContent="space-between"
            >
              <Stack direction="row">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: colorMap[transaction.tag], mr: 2 }}>
                    {iconsMap[transaction.tag]}
                  </Avatar>
                </ListItemAvatar>

                <Typography
                  lineHeight={1.375}
                  sx={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    justifyContent: "center",
                    textTransform: "capitalize",
                  }}
                  textAlign="left"
                >
                  {transaction.description}
                  <br />
                  <Typography lineHeight={1.375} variant="caption">
                    {transaction.tag}
                    {transaction.method ? ` | ${transaction.method}` : ""}
                  </Typography>
                </Typography>
              </Stack>

              <Typography
                textAlign="right"
                lineHeight={1.375}
                sx={{
                  display: "flex",
                  flexFlow: "column nowrap",
                  justifyContent: "center",
                }}
              >
                {transaction.type === "income" ? "+" : "-"}{" "}
                {Number(transaction.value).toFixed(2)} {transaction.currency}
                <br />
                <Typography lineHeight={1.375} variant="caption">
                  x{" "}
                  {Number(
                    transaction.exchangeRates[transaction.currency].ask
                  ).toFixed(2)} | {transaction.createdAt.toLocaleDateString()}
                </Typography>
              </Typography>
            </Stack>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
