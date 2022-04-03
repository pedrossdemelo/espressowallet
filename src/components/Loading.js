import { LocalCafe } from "@mui/icons-material";
import { Box } from "@mui/system";
import React from "react";

function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LocalCafe className="loading-icon" sx={{ fontSize: "10rem", mt: -10 }} />
    </Box>
  );
}

export default Loading;
