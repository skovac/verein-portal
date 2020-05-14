const ownInfo = {
  name: 'Ben Kloos',
  avatar: '/images/avatars/ben_kloos.jpg',
  role: 'Alter Herr',
  city: 'München',
  country: 'Deutschland',
  timezone: 'GTM-0',
};

let storedOwnInfo = null;

function fetchOwnInfo() {
  return ownInfo;
}

export function getOwnInfo() {
  if (storedOwnInfo === null) {
    storedOwnInfo = fetchOwnInfo();
    return storedOwnInfo;
  }
  return storedOwnInfo;
}
