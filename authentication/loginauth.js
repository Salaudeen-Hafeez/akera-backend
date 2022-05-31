import jwt from 'jsonwebtoken';
import { loginValidation } from './reqbodyauth';
import { adminExist, client, userExist } from '../database/db';

const { verify } = jwt;

/* Login authentication. First validate the user login credentials
using loginValidation function. Then check if the user exist. if 
all the check pass run the next() function */
const verifyLogin = async (req, res, next) => {
  const { email } = req.body;
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    } else {
      if (!email.includes('@sendit.com')) {
        const userExist = await userExist(email)
        if (!userExist.rows[0].exists) {
        throw new Error(`These credentials do not match our records`);
        }
        next();
      } else {
        const adminExist = await adminExist(email)
        if (!adminExist.rows[0].exists) {
        throw new Error(`These credentials do not match our records`);
        }
        next();
      }
    }
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
};

const verifyAdminToken = (req, res, next) => {
  const { token, email, username } = req.params;
  if (!token && !(email || username)) {
    throw new Error('Access denied');
  } else {
    try {
      verify(token, 'jakeradming');
      next();
    } catch (error) {
      res.status(400).json({ errMessage: 'Invalid token' });
    }
  }
};

const verifyToken = (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    throw new Error('Access denied');
  } else {
    try {
      if (role === 'admin') {
        verify(token, 'jakeradming');
        next();
      } else if (role === 'user') {
        verify(token, 'jakerag');
        next();
      } else {
        throw new Error('unauthorised user');
      }
    } catch (error) {
      res.status(400).json({ errMessage: 'Invalid token' });
    }
  }
};

const _verifyLogin = verifyLogin;
export { _verifyLogin as verifyLogin };
const _verifyAdminLogin = verifyAdminLogin;
export { _verifyAdminLogin as verifyAdminLogin };
const _verifyUserToken = verifyUserToken;
export { _verifyUserToken as verifyUserToken };
const _verifyAdminToken = verifyAdminToken;
export { _verifyAdminToken as verifyAdminToken };
const _verifyToken = verifyToken;
export { _verifyToken as verifyToken };
