import joi from '@hapi/joi';

// Validate the new user data
const userValidation = (data) => {
  const schema = joi.object({
    name: joi.string().required(),
    username: joi.required(),
    email: joi.string().required().email(),
    password: joi.string().min(6).required(),
  });

  const verified = schema.validate(data);
  return verified;
};

// Validate the user login data
const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().min(6).required(),
  });
  const verified = schema.validate(data);
  return verified;
};

// Validate the package data
const parcelValidation = (data) => {
  const schema = joi.object({
    username: joi.string().required(),
    name: joi.string().required(),
    location: joi.string().required(),
    destination: joi.string().required(),
    sender: joi.string().required(),
    reciever: joi.string().required(),
    frajile: joi.string().required(),
    cost: joi.string().required(),
    weight: joi.string().required(),
  });
  const verified = schema.validate(data);
  return verified;
};

export {userValidation, loginValidation, parcelValidation}
