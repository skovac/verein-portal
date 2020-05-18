import { loginStatus } from '../../util/enums';

export function logout(updateStateIsSignedIn) {
  fetch('http://localhost:1831/logout', {
    method: 'GET',
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
  fetch('http://localhost:1831/is-logged-in', {
    method: 'GET',
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
  myHeaders.append('Content-Type', 'application/json');
  const fields = {
    "username": email,
    "password": password
  };
  fetch('http://localhost:1831/login', {
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
