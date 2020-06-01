import { loginStatus } from '../../util/enums';
import backendURL from '../../BackendUrl';

export function logout(updateStateIsSignedIn) {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", backendURL);
  fetch(backendURL + '/logout', {
    method: 'GET',
    headers: headers,
    credentials: 'include'
  }).then(() => {
    if (updateStateIsSignedIn) {
      updateStateIsSignedIn(loginStatus.signedOut);
    } else {
      window.location.reload();
    }
  });
}

export function isSignedIn(updateStateIsSignedIn) {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", backendURL);
  fetch(backendURL + '/is-logged-in', {
    method: 'GET',
    headers: headers,
    credentials: 'include',
  }).then(res => {
    if (res.status === 200) {
      updateStateIsSignedIn(loginStatus.signedIn);
    } else {
      updateStateIsSignedIn(loginStatus.signedOut);
    }
  });
};

export function signIn(email, password, updateStateIsSignedIn, setLoginFailed) {
  var myHeaders = new Headers();
  myHeaders.append("Access-Control-Allow-Origin", backendURL);
  myHeaders.append('Content-Type', 'application/json');
  const fields = {
    "username": email,
    "password": password
  };
  fetch(backendURL + '/login', {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
    body: JSON.stringify(fields)
  }).then(res => {
    if (res.status === 200) {
      updateStateIsSignedIn(loginStatus.signedIn);
    } else {
      setLoginFailed(true);
    }
  });
}

export function signUp(userInfo) {
  var myHeaders = new Headers();
  myHeaders.append("Access-Control-Allow-Origin", backendURL);
  myHeaders.append('Content-Type', 'application/json');
  const fields = {
    username: userInfo.email,
    password: userInfo.password,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    role: userInfo.memberStatus
  };
  fetch(backendURL + '/register', {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
    body: JSON.stringify(fields)
  }).then(res => {
    window.location.reload();
  });
}
