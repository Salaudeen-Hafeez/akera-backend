// psql --host=ec2-35-171-250-21.compute-1.amazonaws.com --port=5432 --username=faisswttxzvcmk --password --dbname=daui5dqk3pkfe4
import pkg from 'pg';

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect();

const userExist = (username) => {
  const check = client.query(
    `SELECT EXISTS(SELECT 1 FROM users WHERE _email = $1 OR _username = $2)`,
    [username, username]
  );
  return check
}

const adminExist = (username) => {
  const check = client.query(
    `SELECT EXISTS(SELECT 1 FROM admins WHERE _email = $1 OR _username = $2)`,
    [username, username]
  );
  return check
}

const parcelExist = (username) => {
  const check = client.query(
    `SELECT EXISTS(SELECT 1 FROM parcels WHERE _username = $1)`,
    [username]
  );
  return check
}

const getUser = (email) => {
  const user = client.query(`SELECT * FROM users WHERE _email = $1`, [email]);
  return user;
};

const getUsers = () => {
  const user = client.query(`SELECT * FROM users`);
  return user;
};

const getAdmin = (email) => {
  const admin = client.query(`SELECT * FROM admins WHERE _email = $1`, [email]);
  return admin;
};

const getParcels = () => {
  const parcel = client.query(`SELECT * FROM parcels`);
  return parcel;
};

const getUserParcels = (username) => {
  const parcel = client.query(`SELECT * FROM parcels WHERE _username = $1`, [
    username,
  ]);
  return parcel;
};

const postUser = (userData) => {
  const newUser = client.query(
    `INSERT INTO users(
        _name,
        _username,
        _email,
        _password,
        _status,
        _role
        ) 
        VALUES ($1, $2, $3, $4, $5, $6)  RETURNING *`,
    userData
  );
  return newUser;
};

const postAdmin = (adminData) => {
  const newAdmin = client.query(
    `INSERT INTO admins(
        _name,
        _username,
        _email,
        _password,
        _status,
        _role
        ) 
        VALUES ($1, $2, $3, $4, $5, $6)  RETURNING *`,
    adminData
  );
  return newAdmin;
};

const postParcel = (packageData) => {
  const newPackage = client.query(
    `INSERT INTO parcels (
        _name,
        _location,
        _destination,
        _sender,
        _reciever,
        _frajile,
        _username,
        _cost,
        tracking_id,
        _weight,
        _status
        ) VALUES (
          $1, $2, $3, $4,
          $5, $6, $7, $8, $9, $10, $11
          ) RETURNING *`,
    packageData
  );
  return newPackage;
};

const updateParcel = (key, value, con) => {
  const userpackage = client.query(
    `UPDATE parcels SET ${key} = $1 WHERE 
      parcel_id = $2 RETURNING *`,
    [value, con]
  );
  return userpackage;
};

const deleteUser = (userData) => {
  const deletedUser = client.query(
    `DELETE FROM users WHERE _username = $1 OR 
       users_id = $2 RETURNING *`,
    userData
  );
  return deletedUser;
};

const deleteParcel = (parcelId) => {
  const deletedPackage = client.query(
    `DELETE FROM packages WHERE _username = $1 AND 
       parcel_id = $2 RETURNING *`,
    [parcelId]
  );
  return deletedPackage;
};

export {
  userExist,
  adminExist,
  parcelExist,
  getUser, 
  getUsers,
  getAdmin, 
  getParcels, 
  getUserParcels, 
  postUser, 
  postAdmin, 
  postParcel,
  updateParcel,
  deleteUser,
  deleteParcel
}
