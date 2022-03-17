import { Event } from "@mui/icons-material";
import { DatePicker } from "@mui/lab";
import {
  FormControl,
  IconButton,
  Input,
  Stack,
  Typography,
} from "@mui/material";

export default function OverviewAndFilters() {
  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        sx={{ mx: 3.5 }}
      >
        <Typography variant="h6">Overview</Typography>

        <DatePicker
          views={["month", "year"]}
          autoFocus
          value={new Date()}
          onChange={() => {}}
          minDate={new Date("2008-01-31")}
          maxDate={new Date()}
          renderInput={params => (
            <FormControl style={{ maxWidth: "12em" }}>
              <Input
                disableUnderline
                inputProps={{
                  style: h6Style,
                }}
                endAdornment={
                  params.InputProps.endAdornment ?? (
                    <IconButton edge="end" sx={{ ml: 0.5 }}>
                      <Event />
                    </IconButton>
                  )
                }
                sx={{ textAlign: "right" }}
                ref={params.inputRef}
                {...params.inputProps}
              />
            </FormControl>
          )}
        />
      </Stack>
    </>
  );
}

const h6Style = {
  textAlign: "right",
  fontWeight: 500,
  fontSize: "1.25rem",
  lineHeight: 1.6,
  letterSpacing: "0.0075em",
};
