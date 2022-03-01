
// const [errorMessages, setErrorMessages] = React.useState({});
//   const [isSubmitted, setIsSubmitted] = React.useState(false);
function App() {
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
    marginLeft: 10,
    backgroundColor: "blue",
    color: "white",
    height: 20,
    width: 60,
    fontWeight: "bold",
  },
  userName: {
    fontWeight: "bold",
  },
};

const renderForm = (
  <div className="form">
  <script src="../styles.css" type="text/babel"></script>
    <form onSubmit={handleSubmit} style={cardStyles.container}>
      <div className="input-container" style={cardStyles.field} >
        <label>Username </label>
        <input type="text" name="uname" />
        
      </div>
      <div className="input-container" style={cardStyles.field}>
        <label>Password </label>
        <input type="password" name="pass" />
        
      </div>
      <div className="btn btn-primary">
        <input type="submit" style={cardStyles.button}/>
      </div>
    </form>

  </div>
);

class Login extends React.Component{
  render(){
    return renderForm
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Login />, rootElement);