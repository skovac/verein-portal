import backendURL from '../BackendUrl';

export const getProtocolNbs = (setProtocolList, setProtocolNb) => {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", backendURL);
  fetch(backendURL + '/protocol-nbs', {
    method: 'GET',
    headers: headers,
    credentials: 'include'
  }).then(res => res.json())
    .then(jsonData => {
      setProtocolList(jsonData);
      setProtocolNb(jsonData[jsonData.length - 1]);
    });
}

