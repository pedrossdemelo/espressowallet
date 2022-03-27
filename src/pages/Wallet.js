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
import FilteredUserDataProvider from "components/FilteredUserDataProvider";

function Wallet() {
  return (
    <FilteredUserDataProvider>
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
    </FilteredUserDataProvider>
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
