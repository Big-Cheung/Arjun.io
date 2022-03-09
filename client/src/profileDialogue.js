import * as React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {FaAngleRight} from "react-icons/fa"
import {FaAngleLeft} from "react-icons/fa"

const ProfileDialog = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <div>
      <Button variant="outlined" 
        color="primary" onClick={handleOpen}>
        Profile
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
           Profile
        </DialogTitle>
        <DialogContent>
        <DialogContentText>
            Username
          </DialogContentText>
          <h1>Wins: </h1>
          <h1>Games played: </h1>
          <h1>Points: </h1>
          <div>
          <IconButton color="primary" aria-label="upload picture" component="span">
          <FaAngleLeft />
  </IconButton>
          <IconButton color="primary" aria-label="upload picture" component="span">
          <FaAngleRight />
  </IconButton>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
           Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export default ProfileDialog;