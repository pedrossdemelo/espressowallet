import { Box } from "@mui/material";
import { ExpenseForm, WalletHeader } from "../components";

function Wallet() {
  return (
    <>
      <WalletHeader />
      <Box component="main" sx={mainStyle}>
        {/* <ExpenseTable /> */}
      </Box>
      <ExpenseForm />
    </>
  );
}

const mainStyle = { overflowX: "hidden" };

export default Wallet;
