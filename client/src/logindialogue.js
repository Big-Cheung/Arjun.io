import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


async function loginUser(creds) {
  return fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(creds)
  })
  .then(data =>data.json)
}
const LoginDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState();
  const [username, setUser] = React.useState();
  const [password, setPassword] = React.useState();
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSubmit = async e =>{
    e.preventDefault();
    const token = await loginUser({
        username,
        password
    });
    setToken(token);
    console.log(token);
    console.log ('logged in');
    handleClose();
}

  return (
    <div>
      <Button variant="outlined" 
              color="primary" onClick={handleClickOpen}>
        Log In
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
           Sign In
        </DialogTitle>
        <DialogContent>
        <DialogContentText>
            Please enter your email and poassword
          </DialogContentText>
        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email"
            type="username"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setUser(e.target.value);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
           Close
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
           Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default LoginDialog;