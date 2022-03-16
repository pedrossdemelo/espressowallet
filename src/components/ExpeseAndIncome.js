import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import React from "react";

export default function ExpeseAndIncome() {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
          pb: 1.75,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <IconButton>
            <Avatar sx={{ bgcolor: "success.light" }}>
              <ArrowUpward />
            </Avatar>
          </IconButton>

          <Typography variant="h6" sx={{ lineHeight: 1 }} py={0.5}>
            <Typography variant="caption" component="label">
              Total income:
            </Typography>
            <br />
            {totalIncomes} BRL
          </Typography>
        </Box>

        <Box sx={{ display: "flex", mr: -0.75 }}>
          <Typography
            variant="h6"
            sx={{ lineHeight: 1 }}
            textAlign="right"
            py={0.5}
          >
            <Typography variant="caption" component="label">
              Total expenses:
            </Typography>
            <br />
            {totalExpenses} BRL
          </Typography>

          <IconButton>
            <Avatar sx={{ bgcolor: "error.light" }}>
              <ArrowDownward />
            </Avatar>
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
          pb: 1.75,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <IconButton>
            <Avatar sx={{ bgcolor: "success.light" }}>
              <ArrowUpward />
            </Avatar>
          </IconButton>

          <Typography variant="h6" sx={{ lineHeight: 1 }} py={0.5}>
            <Typography variant="caption" component="label">
              Total income:
            </Typography>
            <br />
            {totalIncomes} BRL
          </Typography>
        </Box>

        <Box sx={{ display: "flex", mr: -0.75 }}>
          <Typography
            variant="h6"
            sx={{ lineHeight: 1 }}
            textAlign="right"
            py={0.5}
          >
            <Typography variant="caption" component="label">
              Total expenses:
            </Typography>
            <br />
            {totalExpenses} BRL
          </Typography>

          <IconButton>
            <Avatar sx={{ bgcolor: "error.light" }}>
              <ArrowDownward />
            </Avatar>
          </IconButton>
        </Box>
      </Box>
    </>
  );
}
