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
  .then((res) => {
    return res.json()
  }).then(data => {
    return data;
  })
}

const LoginDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [username, setUser] = React.useState("");
  const [password, setPassword] = React.useState("n");
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSubmit = async e =>{
    e.preventDefault();

    if (password == "" || username == "") {
      return;
    }
    
    const data = await loginUser([
        username,
        password
    ]);
    //If this is the case, login failed
    //We can probably improve this code with more data
    //but for now, lets just get this thing logged in
    console.log(data)
    if (data.status == "failed") {
      //handle failed login response
      console.log(data.msg);
      return;
    }
    console.log(data.user);
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