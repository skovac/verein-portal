let isAuth = false;

export function isSignedIn() {
  /*fetch('http://localhost:1831/is-logged-in').then(res => {
    if (res.status === 200) {
      isAuth = true;
    } else {
      isAuth = false;
  }});*/
  return isAuth;
};

export function signIn(email, password, confirmLogin, setLoginFailed) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  const fields = {
    "username": email,
    "password": password
  };
  console.log(fields);

  fetch('http://localhost:1831/login', {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(fields)
  }).then(res => {
    console.log(res);
    if (res.status === 200) {
      isAuth = true;
      confirmLogin();
    } else {
      setLoginFailed(true);
    }
  });
}
