import { Box } from "@mui/material";
import {
  ExpenseAndIncome,
  ExpenseInfo,
  GoBackFab,
  History,
  IncomeInfo,
  NewUserPopup,
  NoTransactionsYet,
  OverviewDate,
  SpeedDials,
  WalletHeader,
} from "components";

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
        {/* If there is no transactions in the filter, show this: */}
        <NoTransactionsYet />
      </Box>

      <SpeedDials />

      <GoBackFab />

      <NewUserPopup />
    </>
  );
}

const mainStyle = {
  bgcolor: "#fafaf9",
  minHeight: "100vh",
  maxWidth: "600px",
  mx: "auto",
  display: "flex",
  flexFlow: "column nowrap",
  gap: 2,
};

export default Wallet;
