
// const [errorMessages, setErrorMessages] = React.useState({});
//   const [isSubmitted, setIsSubmitted] = React.useState(false);
import * as React from 'react'
import ReactDOM from 'react-dom';
import { BooleanKeyframeTrack } from 'three';
//import { FaHeart } from "react-icons/fa";
//import LoginIcon from '@material-ui/icons/AccountCircle';
//import { MDBIcon } from "mdbreact";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import LoginDialogue from './logindialogue.js'
import SignUpDialogue from './signupdialogue.js'
// import { Dialog } from '@mui/material'
//import Stack from '@mui/material/Stack';
function App() {
  const [open, setOpen] = React.useState(false);
  
  
  // React States
  const [errorMessages, setErrorMessages] = React.useState({});
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // User Login info
  const database = [
    {
      username: "user1",
      password: "pass1"
    },
    {
      username: "user2",
      password: "pass2"
    }
  ];

  const errors = {
    uname: "invalid username",
    pass: "invalid password"
  };

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname, pass } = document.forms[0];

    // Find user login info
    const userData = database.find((user) => user.username === uname.value);

    // Compare user info
    if (userData) {
      if (userData.password !== pass.value) {
        // Invalid password
        setErrorMessages({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
      }
    } else {
      // Username not found
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };
  

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (

    <div className="form">
      <script src="../styles.css" type="text/babel"></script>
      <form onSubmit={handleSubmit} class="form" id="login">
        <div className="input-container">
          <label>Username </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Password </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
      </form>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Sign In</div>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div>
    </div>
  );
}


const handleSubmit = (event) => {
  //Prevent page reload
  event.preventDefault();

  var { uname, pass } = document.forms[0];

  // Find user login info

};
const mystyle = {
  color: "white",
  backgroundColor: "#ffa64d",
  padding: "15px",
  fontFamily: "Arial",
  innerHeight: "300px",
  innerWidth: "200px",
  outerWidth: "200px",
};

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
    backgroundColor: "black",
    color: "white",
    padding: "10px 60px",
    borderRadius: "5px",
    justifyContent: 'space-between'
  },
  userName: {
    fontWeight: "bold",
  },
};
// const renderForm = (
//   // <div className="form">
//   // <script src="../styles.css" type="text/babel"></script>
//   //   <form onSubmit={handleSubmit} style={cardStyles.container}>
//   //     <div className="input-container" style={cardStyles.field} >
//   //       <label>Username </label>
//   //       <input type="text" name="uname" />

//   //     </div>
//   //     <div className="input-container" style={cardStyles.field}>
//   //       <label>Password </label>
//   //       <input type="password" name="pass" />

//   //     </div>
//   //     <div className="btn btn-primary">
//   //       <input type="submit" style={cardStyles.button}/>
//   //     </div>
//   //   </form>

//   // </div>
//   <div className="form">
//     <script src="../styles.css" type="text/babel"></script>
//     <div onClick={() => this.handleClick()} className='Profile'>
//       <button class="dropbtn">Dropdown</button>
//     </div>
//     <div className="drop1">
//       <button>Sign In</button>
//       <button>Log In</button>
//     </div>

//   </div>
// );
class Login extends React.Component {
  
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {buttonIsPressed: false, LoginDialog: false, SignUpDialog: false, isLoggedIn: false};
  }
  handleLoginClick() {
    if(this.buttonIsPressed)
      this.setState({buttonIsPressed: false});
    else
      this.setState({buttonIsPressed: true});
  }

  handleLogoutClick() {
    this.setState({buttonIsPressed: false});
  }

  handleClick = (index) => {
    console.log("button clicked" + index);
    if(this.buttonIsPressed == true){
      this.setState({buttonIsPressed: false});

    }
    else if (this.buttonIsPressed == false || this.buttonIsPressed == undefined){
      this.setState({buttonIsPressed: true});
    }
    if(index == 1){
      this.setState({LoginDialog: true})
    }
    if(index == 2){
      this.setState({SignUpDialog: true, LoginDialog: false})
    }
  }
  render() {
    const buttonIsPressed = this.state.buttonIsPressed;
    const isLoggedIn = this.state.isLoggedIn;
    const LoginDialog = this.state.LoginDialog;
    const SignUpDialog = this.state.SignUpDialog;
    let button;
    return (
      <div className="form">
    <script src="../styles.css" type="text/babel"></script>
    
    <Button variant="outlined" 
              color="secondary" onClick={() => this.handleClick(0)}>
        Guest
      </Button>
    <div className="drop1">
      {buttonIsPressed && !isLoggedIn? <div> 
      <LoginDialogue /> 
      <SignUpDialogue /> </div>
      : <div><span></span></div>}
      
    </div>
    <div>
      
    </div>
    {/* <div>
      <Button variant="outlined" 
              color="primary" onClick={handleClickOpen}>
        Open My Custom Dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
           Greetings from GeeksforGeeks
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you do coding ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
           Close
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
           Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div> */}
    {/* <Button startIcon={<LoginIcon />} color="primary" variant="contained">
  Login
</Button> */}
    

  </div>
  
    );
    
  }
  
  // render() {
  //     return (
  //       <div>
  //       <select>
  //         <option value="fruit">Sign In</option>
  //         <option value="vegetable">Log In</option>
  //       </select>
  //     </div>
  //     );
  // }
}
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}

function Greeting(props) {
  const buttonIsPressed = props.buttonIsPressed;
  if (buttonIsPressed) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Login />, rootElement);
export default Login;


{/* <div><div onClick={() => this.handleClick(1)}>
      <button className="dropbtn" style={cardStyles.button} buttonIsPressed={buttonIsPressed}>
      
      <a>Log in</a>
      </button></div>
      <div onClick={() => this.handleClick(2)} >
      <button className="dropbtn" style={cardStyles.button} buttonIsPressed={buttonIsPressed}>
      
      <a>Sign Up</a>
      </button></div> </div>  */}