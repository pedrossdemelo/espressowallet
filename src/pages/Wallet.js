import { Box } from "@mui/material";
import { SpeedDials, WalletHeader } from "../components";
import ExpenseGraph from "../components/ExpenseInfo";

function Wallet() {
  return (
    <>
      <WalletHeader />
      <Box component="main" sx={mainStyle}>
        <Box sx={{ height: 144 }} />
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
