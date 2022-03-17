import { Box } from "@mui/material";
import { SpeedDials, WalletHeader } from "../components";
import ExpenseInfo from "../components/ExpenseInfo";
import ExpenseAndIncome from "../components/ExpenseAndIncome";
import IncomeInfo from "../components/IncomeInfo";
import History from "../components/History";
import OverviewDate from "../components/OverviewDate";

function Wallet() {
  return (
    <>
      <WalletHeader />
      <Box component="main" sx={mainStyle}>
        <Box sx={{ height: { xs: 58, sm: 64 } }} />
        <OverviewDate />
        <ExpenseAndIncome />
        <IncomeInfo />
        <ExpenseInfo />
        <History />
      </Box>
      <SpeedDials />
    </>
  );
}

const mainStyle = {
  overflowX: "hidden",
  bgcolor: "#fafaf9",
  minHeight: "100vh",
  display: "flex",
  flexFlow: "column nowrap",
  gap: 2,
};

export default Wallet;
