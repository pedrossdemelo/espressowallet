import { DeleteOutline, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ExpenseFormDrawer, IncomeFormDrawer, Loading } from "components";
import { colorMap, iconsMap } from "constants";
import { useFilteredTransactions } from "hooks";
import { useEffect, useRef, useState } from "react";
import SwipeableView from "react-swipeable-views";
import { TransitionGroup } from "react-transition-group";
import { deleteTransaction } from "services";

export default function History() {
  const [transactions, loading] = useFilteredTransactions();

  if (loading) return <Loading />;

  if (!transactions.length) return null;

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexFlow: "column nowrap" }}>
      <Typography mb={1} ml={3.5} variant="h6">
        History
      </Typography>

      <List
        sx={{
          pt: 1.5,
          bgcolor: "background.paper",
          borderRadius: "1rem 1rem 0 0",
          boxShadow: 2,
          flexGrow: 1,
          pb: "calc(56px + 1.375rem)",
        }}
      >
        <TransitionGroup>
          {transactions.map(transaction => (
            <Collapse key={transaction.id}>
              <TransactionListItem transaction={transaction} />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </Box>
  );
}

function TransactionListItem(props) {
  const [isHovered, setIsHovered] = useState(false);
  const enter = () => setIsHovered(true);
  const leave = () => setIsHovered(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const open = () => setIsDrawerOpen(true);
  const close = () => setIsDrawerOpen(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const { transaction } = props;

  const delTransaction = () => deleteTransaction(transaction);

  useEffect(() => {
    // Every time the component is rendered, the mouse leaves the element
    leave();
  }, [isDialogOpen, isDrawerOpen]);

  const DesktopListItem = () => (
    <ListItem
      sx={{
        "&:hover": {
          boxShadow: 2,
          borderRadius: 2,
          outline: "0.5px solid lightgray",
        },
        cursor: "pointer",
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
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
                bgcolor: colorMap[transaction.tag],
                mr: 2,
              }}
            >
              {iconsMap[transaction.tag]}
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
            {transaction.description}
            <br />
            <Typography lineHeight={1.375} variant="caption">
              {transaction.tag}
            </Typography>
          </Typography>
        </Stack>

        {isHovered ? (
          <Stack direction="row">
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
        ) : (
          <Typography
            textAlign="right"
            lineHeight={1.375}
            sx={{
              display: "flex",
              flexFlow: "column nowrap",
              justifyContent: "center",
            }}
          >
            {transaction.type === "income" ? "+" : "-"}{" "}
            {Number(transaction.value).toFixed(2)} {transaction.currency}
            <br />
            <Typography lineHeight={1.375} variant="caption">
              x{" "}
              {Number(
                transaction.exchangeRates[transaction.currency].ask
              ).toFixed(2)}{" "}
              |{" "}
              {transaction.createdAt
                .toLocaleDateString()
                .split("/")
                .slice(0, 2)
                .join("/")}{" "}
              {transaction.createdAt.getHours()}:
              {transaction.createdAt.getMinutes().toString().padStart(2, "0")}
            </Typography>
          </Typography>
        )}
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
          bgcolor: "error.light",
          height: "100%",
          borderRadius: 2,
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
                  bgcolor: colorMap[transaction.tag],
                  mr: 2,
                }}
              >
                {iconsMap[transaction.tag]}
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
              {transaction.description}
              <br />
              <Typography lineHeight={1.375} variant="caption">
                {transaction.tag}
              </Typography>
            </Typography>
          </Stack>

          <Typography
            textAlign="right"
            lineHeight={1.375}
            sx={{
              display: "flex",
              flexFlow: "column nowrap",
              justifyContent: "center",
            }}
          >
            {transaction.type === "income" ? "+" : "-"}{" "}
            {Number(transaction.value).toFixed(2)} {transaction.currency}
            <br />
            <Typography lineHeight={1.375} variant="caption">
              x{" "}
              {Number(
                transaction.exchangeRates[transaction.currency].ask
              ).toFixed(2)}{" "}
              |{" "}
              {transaction.createdAt
                .toLocaleDateString()
                .split("/")
                .slice(0, 2)
                .join("/")}{" "}
              {transaction.createdAt.getHours()}:
              {transaction.createdAt.getMinutes().toString().padStart(2, "0")}
            </Typography>
          </Typography>
        </Stack>
      </ListItem>

      <ListItem
        sx={{
          borderRadius: 2,
          color: "white",
          bgcolor: "primary.light",
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

      {transaction.type === "income" ? (
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

const ConfirmationDialog = ({ open, transaction, close, onConfirm }) => {
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Delete {transaction.type}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the {transaction.type}{" "}
          {transaction.description}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
