import { FilterList } from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import { Button, IconButton, List, ListItem, Stack, SwipeableDrawer, Typography } from "@mui/material";
import React from "react";

export default function OverviewAndFilters() {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);
  const open = () => setIsFilterDrawerOpen(true);
  const close = () => setIsFilterDrawerOpen(false);

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ mx: 3.5, my: -0.5 }}
      >
        <Typography variant="h6">Overview</Typography>

        <Stack alignItems="center" direction="row">
          <Typography variant="h6" mr={0.5} textAlign="right">
            Last month
          </Typography>

          <IconButton onClick={open} edge="end">
            <FilterList />
          </IconButton>
        </Stack>
      </Stack>

      <SwipeableDrawer
        anchor="bottom"
        PaperProps={paperProps}
        open={isFilterDrawerOpen}
        onClose={close}
      >
        <List
          component="form"
          sx={{
            borderRadius: "1rem 1rem 0 0",
            bgcolor: "background.paper",
            boxShadow: 3,
          }}
        >
          <ListItem>
            <DatePicker />
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}

const paperProps = { style: { backgroundColor: "transparent" } };
