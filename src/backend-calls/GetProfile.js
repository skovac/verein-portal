import backendURL from '../BackendUrl';

export const ownPicUrl = backendURL + "/own-profile-pic";

export const templInfo = {
  name: '',
  role: '',
  city: '',
  country: '',
  timezone: '',
};

let storedOwnInfo = null;

async function fetchOwnInfo(setUser) {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", backendURL);
  fetch(backendURL + '/own-info', {
    method: 'GET',
    headers: headers,
    credentials: 'include'
  }).then(res => res.json())
    .then(data => {
      setUser(data);
      storedOwnInfo = data;
    });
}

export function getOwnInfo(setUser) {
  if (storedOwnInfo === null) {
    fetchOwnInfo(setUser);
  } else {
    setUser(storedOwnInfo);
  }
}

export function resetCache() {
  storedOwnInfo = null;
}

export function updateProfile(user) {
  //if the user leaves the email blank the account has no username anymore and can't be accessed.
  if(!user.email) { return }

  const myHeaders = new Headers();
  myHeaders.append("Access-Control-Allow-Origin", backendURL);
  myHeaders.append('Content-Type', 'application/json'); 
  console.log(user);
  fetch(backendURL + '/update-profile', {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
    body: JSON.stringify(user)
  }).then(() => window.location.reload());
}

export function uploadProfilePic(picFile) {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", backendURL);
  fetch(backendURL + '/upload-profile-pic', {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
    body: picFile
  })
}

export function deleteProfilePic(picFile) {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", backendURL);
  fetch(backendURL + '/delete-profile-pic', {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    credentials: 'include',
    cache: 'default'
  }).then(() => window.location.reload());
}
