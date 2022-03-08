import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
  
const SignUpDialog = () => {
  const [open, setOpen] = React.useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <div>
      <Button variant="outlined" 
              color="primary" onClick={handleClickOpen}>
        Sign Up
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
           Sign Up
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email, username, and password
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username"
            type="username"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
           Close
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
           Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
  
export default SignUpDialog;