import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
const cardStyles = {
    container: {
      display: "flex",
      height: 100,
      width: 400,
      boxShadow: "0 0 3px 2px #cec7c759",
      alignItems: "center",
      padding: 20,
      borderRadius: 20,
    },
    field: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "gray",
      color: "white",
      height: 40,
      width: 200,
      padding: 10,
      fontWeight: "bold",
    },
    button: {
      color: "rgb(0, 51, 204)",
      justifyContent: 'space-between',
      position: "fixed",
      top: "0px",
      right: "220px",
    },
    userName: {
      fontWeight: "bold",
    },
  };
const TitleScreen = () => {
  return (
    <div>
      <h1 style={cardStyles.button}>Welcome to Arjun.io!</h1>
    </div>
  );
}


export default TitleScreen;