import uuid from 'uuid/v1';
import backendURL from '../BackendUrl';

const users = [
  {
    id: uuid(),
    name: 'Alex Erk',
    address: {
      country: 'Deutschland',
      state: 'Bayern',
      city: 'München',
      street: 'Beispiel Straße 5'
    },
    email: 'alex.erk@gmail.com',
    phone: '01343289473',
    avatarUrl: '/images/avatars/alex_erk.jpg',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    name: 'Amadeus Dykier',
    address: {
      country: 'Deutschland',
      state: 'Berlin',
      city: 'Berlin',
      street: 'Beispiel Straße 5'
    },
    email: 'amadeus.dykier@gmail.com',
    phone: '01343289473',
    avatarUrl: '/images/avatars/amadeus_dykier.jpg',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    name: 'Ben Kloos',
    address: {
      country: 'Deutschland',
      state: 'Bayern',
      city: 'München',
      street: 'Beispiel Straße 5'
    },
    email: 'ben.kloos@gmail.com',
    phone: '01343289473',
    avatarUrl: '/images/avatars/ben_kloos.jpg',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    name: 'Mihailo Gligoric',
    address: {
      country: 'Schweiz',
      state: '',
      city: 'Zürich',
      street: 'Beispiel Straße 5'
    },
    email: 'gligoric@gmail.com',
    phone: '01343289473',
    avatarUrl: '/images/avatars/mihailo_gligoric.jpg',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    name: 'Ruslan Nekrasov',
    address: {
      country: 'Deutschland',
      state: 'Bayern',
      city: 'München',
      street: 'Beispiel Straße 5'
    },
    email: 'nekrasov@gmail.com',
    phone: '01343289473',
    avatarUrl: '/images/avatars/ruslan_nekrasov.jpg',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    name: 'Stefan Madzharov',
    address: {
      country: 'Deutschland',
      state: 'Bayern',
      city: 'München',
      street: 'Beispiel Straße 5'
    },
    email: 'stefan@gmail.com',
    phone: '01343289473',
    avatarUrl: '/images/avatars/stefan_madzharov.jpg',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    name: 'Tobias Segieth',
    address: {
      country: 'Deutschland',
      state: 'Bayern',
      city: 'München',
      street: 'Beispiel Straße 5'
    },
    email: 'tobi@gmail.com',
    phone: '01343289473',
    avatarUrl: '/images/avatars/tobias_segieth.jpg',
    createdAt: 1555016400000
  }
];

function fetchUsers(setUsers) {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", backendURL);
  fetch(backendURL + '/userlist', {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    credentials: 'include',
    cache: 'default'
  }).then((res) => res.json())
    .then((res) => {
      setUsers(res);
    });
}

export function getUsers(setUsers) {
  fetchUsers(setUsers);
}
