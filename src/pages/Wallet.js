import { Box } from "@mui/material";
import { SpeedDials, WalletHeader } from "../components";
import ExpenseInfo from "../components/ExpenseInfo";
import ExpenseAndIncome from "../components/ExpenseAndIncome";
import IncomeInfo from "../components/IncomeInfo";
import History from "../components/History";
import OverviewDate from "../components/OverviewDate";
import GoBackFab from "../components/GoBackFab";
import NoTransactionsYet from "../components/NoTransactionsYet";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { useHistory } from "react-router-dom";

function Wallet() {
  const [user, loading] = useAuthState(auth);
  const history = useHistory();

  if (loading) return <div>Loading...</div>
  if (!user) {
    history.push("/");
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
