import { FilterList } from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import {
  Button,
  IconButton,
  List,
  ListItem,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
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
          <DatePicker
            views={["year", "month"]}
            autoFocus
            value={new Date()}
            onChange={() => {}}
            label="Ola"
            minDate={new Date("2008-01-31")}
            renderInput={params => <TextField {...params} size="small" />}
          />
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
            <DatePicker
              views={["year", "month"]}
              autoFocus
              value={new Date()}
              onChange={() => {}}
              label="Ola"
              minDate={new Date("2008-01-31")}
              renderInput={params => <TextField {...params} />}
            />
          </ListItem>
        </List>
      </SwipeableDrawer>
    </>
  );
}

const paperProps = { style: { backgroundColor: "transparent" } };
