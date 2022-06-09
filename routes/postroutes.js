import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid'

import * as model from '../database/db';
import { verifyLogin } from '../authentication/loginauth';
import {
  userValidation,
  parcelValidation,
} from '../authentication/reqbodyauth';

const postRouter = Router();
const { compare } = bcrypt;
const { sign } = jwt;

/**
 * components:
 *   schemas:
 *     loginData:
 *       properties:
 *         email:
 *           type: string
 *           example: salaudeen123@gmail.com
 *         password:
 *           type: string
 *           example: Salau132##4$
 *       # Both properties are required
 *        required:  
 *         - id
 *         - name
 */

/**
 * components:
 *   schemas:
 *     userData:
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         name:
 *           type: string
 *           example: Salaudeen Hafeez
 *         username:
 *           type: string
 *           example: Salaudeen123
 *         email:
 *           type: string
 *           example: Salaudeen123@gmail.com
 *         password:
 *           type: string
 *           example: hashed password
 *         status:
 *           type: string
 *           example: active
 */

/**
 * components:
 *   schemas:
 *     parcelData:
 *       properties:
 *         username:
 *           type: string
 *           example: Salaudeen123
 *         name:
 *           type: string
 *           example: A carton of frozen chicken
 *         location:
 *           type: string
 *           example: Adewusi street, Fadeyi Lagos
 *         destination:
 *           type: string
 *           example: Adewusi street, Fadeyi Lagos
 *         sender:
 *           type: string
 *           example: 08133000306
 *         reciever:
 *           type: string
 *           example: 08133000306
 *         frajile:
 *           type: string
 *           example: Not frajile
 *         status:
 *           type: string
 *           example: In transit
 *         cost:
 *           type: string
 *           example: NGN5,000
 *         tracking_id:
 *           type: string
 *           example: 2236gdfrsmmb63wqlwhoq
 *         weight:
 *           type: string
 *           example: 34kg
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login as user or admin.
 *     requestBody:
 *       description: The API to login the user
 *       required: true
 *       schema:
 *         $ref: '#/components/schemas/loginData'
 *     responses:
 *       '200':
 *         description: Logged in.
 *         schema:
 *           $ref: '#/components/schemas/userData' 
*/

/* User login, first verify login credential using verifyLogin 
middle ware. Then get the user data using the getUser function.
Then compare the user passwords. If all the credentials pass the 
check, generate token for the user */
postRouter.post('/login', verifyLogin, async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email.includes('@sendit.com')) {
    const user = await model.getUser(email);
    const passwordPass = await compare(password, user.rows[0]._password); // Check if the password is correct
    if (!passwordPass) {
      throw new Error('These credentials do not match our records');
    }

    const token = sign({ role: user.rows[0]._role, username: user.rows[0]._username }, 'jakerag'); // Generate token for the user
    user.rows[0].auth_token = token;
    res.json({ user: user.rows[0] });
  } else {

    const admin = await model.getAdmin(email);
    const passwordPass = await compare(password, admin.rows[0]._password); // Check if the admin password is correct
    if (!passwordPass) {
      throw new Error(`These credentials do not match our records`);
    }

    const token = sign(
      { role: admin.rows[0]._role }, // Generate token for the admin
      'jakeradming'
    );

    admin.rows[0].admin_token = token;
    res.json({ admin: admin.rows[0] });
  }
    
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create user or admin.
 *     requestBody:
 *       description: The API to login the user
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/userData'
 *     responses:
 *       201:
 *         description: Created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userData' 
*/

/* Validate the new incoming user data. Then check if 
the user already exist. If the user does not exist add 
the user to the database */
postRouter.post('/signup', async (req, res) => {
  delete req.body.password2;
  const { error } = userValidation(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  } else {
    const email = req.body.email
    const salt = await bcrypt.genSalt(5);
    const hashPass = await bcrypt.hash(req.body.password, salt); // encrypt the password
    try {

      if (!email.includes('@sendit.com')){
        const check = await model.userExist(email)
        if (check.rows[0].exists) {
        throw new Error('Account exist');
        } else {
          const user = req.body;
          user.password = hashPass;
          const userData = Object.values(user);
          userData[4] = 'active';
          userData[5] = 'user';
          const newUser = await model.postUser(userData);
          if (newUser.rows[0].users_id) {
            const packages = await model.getUserParcels(newUser.rows[0]._username);
            res.json({ user: newUser.rows[0], packages: packages.rows });
          }
        }
      } else {
        const check = await model.adminExist(email)
        if (check.rows[0].exists) {
          throw new Error('Account exist');
        } else {
          const admin = req.body;
          admin.password = hashPass;
          const adminData = Object.values(admin);
          adminData[4] = 'active';
          userData[5] = 'admin';
          const newAdmin = await model.postAdmin(adminData);
          if (newAdmin.rows[0].users_id) {
            res.json({ admin: newAdmin.rows[0] });
          }
        }
      }
      
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
});

/**
 * @swagger
 * /parcels:
 *   post:
 *     summary: Create new parcels order.
 *     requestBody:
 *       description: The API to create new parcel order.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/parcelData'
 *     responses:
 *       201:
 *         description: Logged in.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/parcelData' 
*/

/* Verify the user token using verifyToken middle ware. if 
token is correct, check if the frijile property is empty. 
if everything is fine add the package to the database  */
postRouter.post(
  '/parcels',
  async (req, res) => {
    const { username } = req.params;
    const reqBody = req.body;
    if (reqBody.frajile === '') {
      reqBody['frajile'] = 'package not frajile';
    }
    const { error } = parcelValidation(reqBody); // Validate the incoming package data
    if (error) {
      throw new Error(error.details[0].message);
    } else {
      try {
        reqBody['tracking_id'] = uuidv4();
        const packageData = Object.values(req.body);
        packageData.push('Ready for pickup');
        const newPackage = await model.postParcel(packageData);
        if (newPackage.rowCount === 1) {
          const userPackage = await model.getUserParcels(username)
          res.json({ packages: userPackage.rows, package: newPackage.rows[0] });
        }
      } catch (error) {
        res.status(400).json({ errMessage: error.message });
      }
    }
  }
);

export default postRouter;
