import backendURL from '../BackendUrl';

export const getTzNbs = (setTzList) => {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", backendURL);
  fetch(backendURL + '/tz-nbs', {
    method: 'GET',
    headers: headers,
    credentials: 'include'
  }).then(res => res.json())
    .then(jsonData => setTzList(jsonData));
}

