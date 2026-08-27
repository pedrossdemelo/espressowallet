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
  SwipeRevealItem,
} from "components";
import { colorMap, iconsMap } from "constants";
import { errorMessage, useSnackbar } from "context";
import { useMode } from "hooks";
import { useState } from "react";
import { deleteTransaction } from "services";
import { TransactionWithId } from "types";

interface TransactionListItemProps {
  transaction: TransactionWithId;
}

export function TransactionListItem(props: TransactionListItemProps) {
  const { theme, isLight } = useMode();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const open = () => setIsDrawerOpen(true);
  const close = () => setIsDrawerOpen(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const { transaction } = props;
  const { showError } = useSnackbar();

  const delTransaction = () =>
    deleteTransaction(transaction).catch(err =>
      showError(errorMessage(err, "Couldn't delete the transaction.")),
    );

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
          bgcolor: theme.palette.action.hover,
          "& .edit-delete": {
            display: "flex",
          },
          "& .transaction-details": {
            display: "none",
          },
        },
        "&:hover": {
          bgcolor: theme.palette.action.hover,
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

  const deletePanel = (
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
  );

  const mobileContent = (
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
            {ask !== 1 ? `${(ask * value).toFixed(2)} ${baseCurrency} | ` : ""}
            {date}
          </Typography>
        </Typography>
      </Stack>
    </ListItem>
  );

  const editPanel = (
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
  );

  // Dragging the row towards its end uncovers delete; the other way, edit.
  const mobileListItem = (
    <SwipeRevealItem
      startPanel={deletePanel}
      endPanel={editPanel}
      onStartAction={openDialog}
      onEndAction={open}
    >
      {mobileContent}
    </SwipeRevealItem>
  );

  const isDesktop = useMediaQuery("(pointer: fine)");

  return (
    <>
      {isDesktop ? <DesktopListItem /> : mobileListItem}

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
