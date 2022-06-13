import { Router } from 'express';
import jwt from 'jsonwebtoken'
import { getParcels, getUserParcels, getUsers, parcelExist } from '../database/db';
import {getToken, verifyToken, verifyAdminToken } from '../authentication/loginauth';

const getRouter = Router();

/**
 * @swagger
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
 *     summary: The end point to get all users parcels.
 *     tags:
 *        - Parcels
 *     security:
 *       - bearerAuth: []
 *     tags:
 *        - Parcels
 *     responses:
 *       '200':
 *         description: All parcels fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/parcelData' 
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
 *     tags:
 *        - Parcels
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User parcels fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/parcelData' 
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
