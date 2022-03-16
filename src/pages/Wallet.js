import { Box } from "@mui/material";
import { SpeedDials, WalletHeader } from "../components";
import ExpenseGraph from "../components/ExpenseInfo";
import ExpenseAndIncome from "../components/ExpenseAndIncome";

function Wallet() {
  return (
    <>
      <WalletHeader />
      <Box component="main" sx={mainStyle}>
        <Box sx={{ height: { xs: 58, sm: 64 }, mb: 2 }} />
        <ExpenseAndIncome />
        <ExpenseGraph />
      </Box>
      <SpeedDials />
    </>
  );
}

const mainStyle = {
  overflowX: "hidden",
  bgcolor: "#fafaf9",
  minHeight: "100vh",
};

export default Wallet;
