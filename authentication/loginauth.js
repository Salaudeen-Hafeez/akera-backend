import jwt from 'jsonwebtoken';
import { loginValidation } from './reqbodyauth';
import { adminExist, userExist } from '../database/db';

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
        const check = await userExist(email)
        if (!check.rows[0].exists) {
        throw new Error(`These credentials do not match our records`);
        }
        next();
      } else {
        const check = await adminExist(email)
        if (!check.rows[0].exists) {
        throw new Error(`These credentials do not match our records`);
        }
        next();
      }
    }
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
};

const verifyToken = (req, res, next) => {
  res.json({reques: req})
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

export {verifyLogin, verifyToken, verifyAdminToken}
