import { Router } from 'express';
import jwt from 'jsonwebtoken'
import { getParcels, getUserParcels, getUsers, parcelExist } from '../database/db';
import {getToken, verifyToken, verifyAdminToken } from '../authentication/loginauth';

const getRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *      description: Authenticating users
 *   - name: Parcels
 *      description: Access to parcels orders
 */

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
 * /parcels:
 *   get:
 *     tags:
 *        - Parcels
 *     summary: Get all users parcels.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User parcels fetched successfully.
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
 *     tags:
 *        - Parcels
 *     summary: Get user parcels.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User parcels fetched successfully.
*/

// GET all packages of a single user
getRouter.get('/parcels/user', verifyToken,
  async (req, res) => {
    try {
      const {username}= jwt.decode(getToken(req))
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
