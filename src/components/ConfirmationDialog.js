import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const ConfirmationDialog = ({
    open,
    title,
    btnFirstName,
    btnSecondName,
    handleClose,
    handleDelete,
}) => {
    return (<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            Confirmation
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {title}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>{btnFirstName}</Button>
            <Button onClick={handleDelete} autoFocus>
                {btnSecondName}
            </Button>
        </DialogActions>
    </Dialog>)
}

export default ConfirmationDialog;