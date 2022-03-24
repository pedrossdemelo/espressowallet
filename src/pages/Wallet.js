import { Box } from "@mui/material";
import {
  ExpenseAndIncome,
  ExpenseInfo,
  GoBackFab,
  History,
  IncomeInfo,
  NoTransactionsYet,
  OverviewDate,
  SpeedDials,
  WalletHeader,
} from "components";
import { useAuth } from "hooks";
import { useHistory } from "react-router-dom";

function Wallet() {
  const [user, loading] = useAuth();
  const history = useHistory();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    history.push("/login");
    return null;
  }

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
