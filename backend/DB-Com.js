const session = require('express-session');
const pgSession = require('connect-pg-simple')(session)
const sessionPool = require('pg').Pool
const { Client } = require('pg')
const uuid = require('uuid/v1');

const DBInfo = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PW,
  port: process.env.DB_PORT,
};

const sessionDBaccess = new sessionPool(DBInfo);

const sessionConfig = {
  store: new pgSession({
    pool: sessionDBaccess,
    tableName: 'session'
  }),
  name: '_teutonia-portal-login-cookie',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    aameSite: true,
    secure: false // ENABLE ONLY ON HTTPS
  }
};

const writeToDB = (user) => {
  console.log(user)
  const client = new Client(DBInfo);
  client.connect()
  const query = "INSERT INTO public.users(uuid, username, password, salt, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5, $6, $7);"
  const values = [ uuid(), user.username, user.hash, user.salt, user.firstName, user.lastName, user.role ]
  client.query(query, values, (err, res) => {
    if (err) {
      console.log(err);
    }
    client.end();
  });
}

const findUser = async (user) => {
  const query = "SELECT uuid, password, salt FROM public.users WHERE username=$1";
  const value = [ user.username ];

  const client = new Client(DBInfo);
  client.connect();
  const res = await client.query(query, value);
  client.end();

  if (res.rowCount === 0) {
    return false;
  }

  user.id = res.rows[0].uuid;
  user.hash = res.rows[0].password;
  user.salt = res.rows[0].salt;

  return user;
}

const findUserByUUID = async (id, func) => {
  const query = "SELECT username, password, salt FROM public.users WHERE uuid=$1";
  const value = [ id ];

  const client = new Client(DBInfo);
  client.connect();
  const res = await client.query(query, value);
  client.end();

  if (res.rowCount === 0) {
    return func(1, null);
  }
  row = res.rows[0];
  const user = {
    id: id,
    username: row.username,
    password: row.password,
    salt: row.salt
  };

  return func(null, user);
}

const getProfilePicFile = async (id) => {
  const query = "SELECT profile_pic FROM public.users WHERE uuid=$1";
  const value = [ id ];

  const client = new Client(DBInfo);
  client.connect();
  const res = await client.query(query, value);
  client.end();

  if (res.rowCount === 0) {
    return "";
  } else {
    return res.rows[0].profile_pic;
  }
}

const getUserInfo = async (id) => {
  const query = "SELECT username, first_name, last_name, tel, role, city, state, country, timezone from public.users WHERE uuid=$1";
  const value = [ id ];

  const client = new Client(DBInfo);
  client.connect();
  const res = await client.query(query, value);
  client.end();

  if (res.rowCount === 0) {
    return "";
  } else {
    const rows = res.rows[0];
    const userInfo = {
      email: rows.username,
      firstName: rows.first_name,
      lastName: rows.last_name,
      tel: rows.tel,
      role: rows.role,
      city: rows.city,
      state: rows.state,
      country: rows.country,
      timezone: rows.timezone,
    }
    return userInfo;
  }
}

const updateUser = (user, id) => {
  const query = "UPDATE users set username=$1, first_name=$2, last_name=$3, tel=$4, role=$5, city=$6, state=$7, country=$8, timezone=$9 where uuid=$10";
  const value = [ user.email, user.firstName, user.lastName, user.tel, user.role, user.city, user.state, user.country, user.timezone, id ];

  const client = new Client(DBInfo);
  client.connect();
  client.query(query, value).then(() => client.end());
}

let methods = {
  sessionDBaccess:    sessionDBaccess,
  sessionConfig:      sessionConfig,
  writeToDB:          (user) => writeToDB(user),
  findUser:           (user) => findUser(user),
  findUserByUUID:     (id, func) => findUserByUUID(id, func),
  getProfilePicFile:  (id) => getProfilePicFile(id),
  getUserInfo:        (id) => getUserInfo(id),
  updateUser:         (user, id) => updateUser(user, id)
};

module.exports = methods;
