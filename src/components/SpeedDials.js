import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { ExpenseFormDrawer, IncomeFormDrawer } from "components";
import { useMode } from "hooks";
import { useState } from "react";

export default function SpeedDials() {
  const { isLight } = useMode();

  const [expenseDrawerOpen, setExpenseDrawerOpen] = useState(false);
  const openExpense = () => setExpenseDrawerOpen(true);
  const closeExpense = () => setExpenseDrawerOpen(false);

  const [incomeDrawerOpen, setIncomeDrawerOpen] = useState(false);
  const openIncome = () => setIncomeDrawerOpen(true);
  const closeIncome = () => setIncomeDrawerOpen(false);

  const actions = [
    {
      icon: <ArrowDownward />,
      name: "Expense",
      onClick: openExpense,
      color: `error.${isLight ? "light" : "dark"}`,
      colorHover: "error.main",
    },
    {
      icon: <ArrowUpward />,
      name: "Income",
      onClick: openIncome,
      color: `success.${isLight ? "light" : "dark"}`,
      colorHover: "success.main",
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="New expense or income"
        sx={{ position: "fixed", bottom: "1rem", right: "1rem" }}
        icon={<SpeedDialIcon />}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            tooltipOpen
            FabProps={{
              sx: {
                bgcolor: action.color,
                color: "background.paper",
                "&:hover": { bgcolor: action.colorHover },
              },
            }}
          />
        ))}
      </SpeedDial>

      <ExpenseFormDrawer open={expenseDrawerOpen} close={closeExpense} />

      <IncomeFormDrawer open={incomeDrawerOpen} close={closeIncome} />
    </>
  );
}
