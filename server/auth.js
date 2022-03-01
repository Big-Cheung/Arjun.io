const { getAuth, createUserWithEmailAndPassword } =  require("firebase/auth");

const authenticate = getAuth();
createUserWithEmailAndPassword(authenticate, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });