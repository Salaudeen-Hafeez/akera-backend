CREATE TABLE users(
    users_id SERIAL PRIMARY KEY,
    _name VARCHAR(50) NOT NULL,
    _username VARCHAR(60) UNIQUE NOT NULL,
    _email VARCHAR(100) UNIQUE NOT NULL,
    _password VARCHAR(255) NOT NULL,
    _status VARCHAR(30) NOT NULL
);

CREATE TABLE admins(
    users_id SERIAL PRIMARY KEY,
    _name VARCHAR(60) NOT NULL,
    _username VARCHAR(60) UNIQUE NOT NULL,
    _email VARCHAR(100) UNIQUE NOT NULL,
    _password VARCHAR(255) NOT NULL,
    _status VARCHAR(30) NOT NULL
);

CREATE TABLE parcels(
    parcel_id SERIAL PRIMARY KEY,
    createdBy VARCHAR(60) NOT NULL,
    parcelName VARCHAR(60) NOT NULL,
    pickupLocation VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    senderNumber VARCHAR(60) NOT NULL,
    recieverNumber VARCHAR(60) NOT NULL,
    isFrajile VARCHAR(60) NOT NULL,
    orderStatus VARCHAR(60) NOT NULL,
    totalCost VARCHAR(60) NOT NULL,
    trackingId VARCHAR(255) NOT NULL,
    OrderDate DATE DEFAULT GETDATE(),
    updatedAt DATE,
    parcelWeight VARCHAR(60)
);