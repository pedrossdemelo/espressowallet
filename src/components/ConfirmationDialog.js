import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export const ConfirmationDialog = ({ open, transaction, close, onConfirm }) => {
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Delete {transaction.type}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the {transaction.type} "
          {transaction.description}"?
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
