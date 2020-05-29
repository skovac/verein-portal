export const ownPicUrl = "http://localhost:1831/own-profile-pic";

export const templInfo = {
    name: '',
    role: '',
    city: '',
    country: '',
    timezone: '',
};

let storedOwnInfo = null;

async function fetchOwnInfo(setUser) {
  fetch('http://localhost:1831/own-info', {
    method: 'GET',
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
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json'); 
  console.log(user);
  fetch('http://localhost:1831/update-profile', {
    method: 'POST',
    headers: myHeaders,
    mode: 'cors',
    credentials: 'include',
    cache: 'default',
   body: JSON.stringify(user)
  });//.then(() => window.location.reload());
}
