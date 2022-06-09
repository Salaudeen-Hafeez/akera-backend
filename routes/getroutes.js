import { Router } from 'express';
import jwt from 'jsonwebtoken'
import { getParcels, getUserParcels, getUsers, parcelExist } from '../database/db';
import {verifyAdminToken, verifyToken } from '../authentication/loginauth';

const getRouter = Router();

// GET all the users packages
getRouter.get('/users', verifyAdminToken, async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users.rows);
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: The end point to get all users parcels.
 *     responses:
 *       200:
 *         description: Logged in.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userData' 
*/

// GET all the users packages
getRouter.get('/parcels', verifyAdminToken, async (req, res) => {
  try {
    const packages = await getParcels();
    res.json(packages.rows);
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
});

/**
 * @swagger
 * /parcels/user:
 *   get:
 *     summary: The end point to get all a user's parcels.
 *     responses:
 *       200:
 *         description: Returned user's parcels.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userData' 
*/

// GET all packages of a single user
getRouter.get('/parcels/user', verifyToken,
  async (req, res) => {
    try {
      const {username}= jwt.decode(req.headers.authorization)
      const check = await parcelExist(username)
      if (!check.rows[0].exists) {
        throw new Error('You do not have any package yet');
      } else {
        const packages = await getUserParcels(username)
        res.json(packages.rows);
      }
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

export default getRouter;
