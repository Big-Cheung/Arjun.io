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
import { read, listen } from './events.js';

const ProfileDialog = () => {
  const [open, setOpen] = React.useState(false);
  var nullData = {user: "", wins: 0, points: 0, games: 0, model: 0, uid: ""};
  const [userData, setuserData] = React.useState(nullData);
  listen("login",(e)=>{setuserData(e)});
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
            {userData.user}
          </DialogContentText>
          <h1>Wins: {userData.wins}</h1>
          <h1>Games played: {userData.games}</h1>
          <h1>Points: {userData.points}</h1>
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