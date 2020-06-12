import backendURL from '../BackendUrl';

export const getPdfNbs = (pdfBackendPath, setPdfList, setPdfNb) => {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", backendURL);
  fetch(backendURL + pdfBackendPath, {
    method: 'GET',
    headers: headers,
    credentials: 'include'
  }).then(res => res.json())
    .then(jsonData => {
      setPdfList(jsonData.reverse());
      setPdfNb(jsonData[0]);
    });
}

