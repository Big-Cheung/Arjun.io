import React, {useState} from 'react';
import PropTypes from 'prop-types';

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
export default function Login({setToken}) {
  const [username, setUser] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async e =>{
      e.preventDefault();
      const token = await loginUser({
          username,
          password
      });
      setToken(token);
      console.log(token)
  }
  return(
    <div className = "login-wrapper">
    <script src="../styles.css" type="text/babel"></script>
    <h1>Login</h1>
    <form onSubmit = {handleSubmit}>
      <div className = "input-container">
      <label>
        <p>Email</p>
        <input type="email" name = "email" onChange = {e => setUser(e.target.value)} required />
      </label>
      </div>
      <div className = "input-container">
      <label>
        <p>Password</p>
        <input type="password" name = "pass" onChange = {e => setPassword(e.target.value)} required/>
      </label>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
    </div>
  )
}

Login.propTypes = {
    setToken:PropTypes.func.isRequired
}