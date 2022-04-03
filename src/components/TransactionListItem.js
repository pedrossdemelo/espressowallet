import { DeleteOutline, Edit } from "@mui/icons-material";
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  ConfirmationDialog,
  ExpenseFormDrawer,
  IncomeFormDrawer,
} from "components";
import { colorMap, iconsMap } from "constants";
import { useMode } from "hooks";
import { useRef, useState } from "react";
import SwipeableView from "react-swipeable-views";
import { deleteTransaction } from "services";

export function TransactionListItem(props) {
  const { theme, isLight } = useMode();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const open = () => setIsDrawerOpen(true);
  const close = () => setIsDrawerOpen(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const { transaction } = props;

  const delTransaction = () => deleteTransaction(transaction);

  const {
    tag,
    description,
    exchangeRates,
    currency,
    createdAt,
    baseCurrency,
    value,
    type,
  } = transaction;

  const realRate = exchangeRates[baseCurrency] / exchangeRates[currency];

  const ask = realRate;

  const date = `${createdAt
    .toLocaleDateString()
    .split("/")
    .slice(0, 2)
    .join("/")} ${createdAt.getHours().toString().padStart(2, "0")}:${createdAt
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const DesktopListItem = () => (
    <ListItem
      sx={{
        "&:focus": {
          bgcolor: isLight ? theme.palette.action.hover : "#2a2a2a",
          "& .edit-delete": {
            display: "flex",
          },
          "& .transaction-details": {
            display: "none",
          },
        },
        "&:hover": {
          bgcolor: isLight ? theme.palette.action.hover : "#2a2a2a",
          "& .edit-delete": {
            display: "flex",
          },
          "& .transaction-details": {
            display: "none",
          },
        },
        "& .edit-delete": {
          display: "none",
        },
        "& .transaction-details": {
          display: "flex",
        },
        cursor: "pointer",
      }}
    >
      <Stack
        direction="row"
        sx={{
          flexGrow: 1,
        }}
        justifyContent="space-between"
      >
        <Stack direction="row">
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor: colorMap[tag],
                mr: 2,
                color: "common.white",
              }}
            >
              {iconsMap[tag]}
            </Avatar>
          </ListItemAvatar>

          <Typography
            lineHeight={1.375}
            sx={{
              display: "flex",
              flexFlow: "column nowrap",
              justifyContent: "center",
              textTransform: "capitalize",
            }}
            textAlign="left"
          >
            {description}
            <br />
            <Typography
              color="text.secondary"
              lineHeight={1.375}
              variant="caption"
            >
              {tag}
            </Typography>
          </Typography>
        </Stack>

        {/* When hovered, render this */}
        <Stack direction="row" className="edit-delete">
          <Tooltip arrow placement="top" title="Edit">
            <IconButton onClick={open}>
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip arrow placement="top" title="Delete">
            <IconButton onClick={openDialog}>
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Otherwise, render this */}
        <Typography
          textAlign="right"
          lineHeight={1.375}
          className="transaction-details"
          color={
            type === "income"
              ? `success.${isLight ? "dark" : "light"}`
              : `error.${isLight ? "dark" : "light"}`
          }
          sx={{
            display: "flex",
            flexFlow: "column nowrap",
            justifyContent: "center",
          }}
        >
          {Number(value).toFixed(2)} {currency}
          <br />
          <Typography
            color="text.secondary"
            lineHeight={1.375}
            variant="caption"
          >
            {ask !== 1 ? `${(ask * value).toFixed(2)} ${baseCurrency} | ` : ""}
            {date}
          </Typography>
        </Typography>
      </Stack>
    </ListItem>
  );

  const reachedThreshHold = useRef(null);

  const handleSwitching = index => {
    // When the gesture stops, the index will always be 1, so ignore it
    if (index === 1) return;
    // If the user has reached the left threshold, open the delete confirmation dialog once the gesture stops
    if (index <= 0.75) reachedThreshHold.current = "left";
    // If the user has reached the right threshold, open the edit dialog once the gesture stops
    else if (index >= 1.25) reachedThreshHold.current = "right";
    // If the user has reached neither threshold, or decided not to delete or edit by going back, reset the threshold
    else reachedThreshHold.current = null;
  };

  const handleSwipeEnd = () => {
    if (reachedThreshHold.current === "left") openDialog();
    if (reachedThreshHold.current === "right") open();
    reachedThreshHold.current = null;
  };

  const MobileListItem = () => (
    <SwipeableView
      hysteresis={99}
      threshold={99}
      onSwitching={handleSwitching}
      onTransitionEnd={handleSwipeEnd}
      index={1}
    >
      <ListItem
        sx={{
          color: "white",
          justifyContent: "flex-end",
          bgcolor: isLight ? "error.light" : "error.dark",
          height: "100%",
          borderRadius: 1,
          borderBottomLeftRadius: 0,
          borderTopLeftRadius: 0,
          overflow: "visible",
        }}
      >
        <Stack direction="row">
          <DeleteOutline />
        </Stack>
      </ListItem>

      <ListItem>
        <Stack
          direction="row"
          sx={{
            flexGrow: 1,
          }}
          justifyContent="space-between"
        >
          <Stack direction="row">
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: colorMap[tag],
                  mr: 2,
                  color: "common.white",
                }}
              >
                {iconsMap[tag]}
              </Avatar>
            </ListItemAvatar>

            <Typography
              lineHeight={1.375}
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                justifyContent: "center",
                textTransform: "capitalize",
              }}
              textAlign="left"
            >
              {description}
              <br />
              <Typography
                color="text.secondary"
                lineHeight={1.375}
                variant="caption"
              >
                {tag}
              </Typography>
            </Typography>
          </Stack>

          <Typography
            textAlign="right"
            lineHeight={1.375}
            color={
              type === "income"
                ? `success.${isLight ? "dark" : "light"}`
                : `error.${isLight ? "dark" : "light"}`
            }
            sx={{
              display: "flex",
              flexFlow: "column nowrap",
              justifyContent: "center",
            }}
          >
            {Number(value).toFixed(2)} {currency}
            <br />
            <Typography
              color="text.secondary"
              lineHeight={1.375}
              variant="caption"
            >
              {ask !== 1
                ? `${(ask * value).toFixed(2)} ${baseCurrency} | `
                : ""}
              {date}
            </Typography>
          </Typography>
        </Stack>
      </ListItem>

      <ListItem
        sx={{
          borderRadius: 1,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          color: "white",
          bgcolor: isLight ? "primary.light" : "primary.dark",
          height: "100%",
        }}
      >
        <Stack direction="row">
          <Edit />
        </Stack>
      </ListItem>
    </SwipeableView>
  );

  const isDesktop = useMediaQuery("(pointer: fine)");

  return (
    <>
      {isDesktop ? <DesktopListItem /> : <MobileListItem />}

      {type === "income" ? (
        <IncomeFormDrawer
          toEdit={transaction}
          open={isDrawerOpen}
          close={close}
        />
      ) : (
        <ExpenseFormDrawer
          toEdit={transaction}
          open={isDrawerOpen}
          close={close}
        />
      )}

      <ConfirmationDialog
        open={isDialogOpen}
        close={closeDialog}
        onConfirm={delTransaction}
        transaction={transaction}
      />
    </>
  );
}
