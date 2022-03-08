import * as fb from 'firebase/app';
import {getAuth} from 'firebase/auth';
import { getDatabase } from "firebase/database";
// Your web app's Firebase configuration
const fbApp = fb.initializeApp({
  apiKey: "AIzaSyB1U7iVCc3E--AwAcDv6td2AZaM8YyOxNY",
  authDomain: "arjunio.firebaseapp.com",
  databaseURL: "https://arjunio-default-rtdb.firebaseio.com",
  projectId: "arjunio",
  storageBucket: "arjunio.appspot.com",
  messagingSenderId: "1024233461521",
  appId: "1:1024233461521:web:827df22c397ef47e7a9eb0"
});
const auth = getAuth();
const db = getDatabase();
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin === -1) {
      begin = dc.indexOf(prefix);
      if (begin !== 0) return null;
  }
  else
  {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end === -1) {
      end = dc.length;
      }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
} 
export {fbApp, auth, db, getCookie}