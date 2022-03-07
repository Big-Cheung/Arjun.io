import React from 'react';

export default function Register() {
  return(
    <div>
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
  )
}