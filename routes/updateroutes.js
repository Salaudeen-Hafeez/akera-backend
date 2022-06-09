import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAdminToken, verifyToken } from '../authentication/loginauth';
import { updateParcel, getUserParcels, getParcels } from '../database/db';

const updateRouter = Router();

/**
 * @swagger
 * /parcels/{id}/destination:
 *   put:
 *     summary: The end point to hange the parcel order destination.
 *     parameters:
 *       - name: parcelId
 *         in: path
 *         required: true
 *         schema:
 *           type : integer
 *           format: int64
 *           minimum: 1
 *     requestBody:
 *       description: The new destination to change on parcel order.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newDestination:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/parcelData' 
*/

// UPDATE the status of the user's parcel
updateRouter.put(
  '/parcels/:id/destination',
  verifyToken,
  async (req, res) => {
    const token = req.headers.authorization;
    const {username} = jwt.decode(token);
    const { id } = req.params;
    const con = parseInt(id);
    const value = Object.values(req.body);
    const key = Object.keys(req.body);
    try {
      const updatedParcel = await updateParcel(key[0], value[0], con);
      const packages = await getUserParcels(username)
      res.json({ package: updatedParcel.rows[0], packages: packages.rows });
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

/**
 * @swagger
 * /parcels/{id}/status:
 *   put:
 *     summary: The end point to change the parcel order status.
 *     parameters:
 *       - name: parcelId
 *         in: path
 *         required: true
 *         schema:
 *           type : integer
 *           format: int64
 *           minimum: 1
 *     requestBody:
 *       description: The new status of the parcel order.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/parcelData' 
*/

// UPDATE the status of the user's parcel
updateRouter.put(
  '/parcels/:id/status',
  verifyAdminToken,
  async (req, res) => {
    const token = req.headers.authorization;
    const {username} = jwt.decode(token);
    const { id } = req.params;
    const con = parseInt(id);
    const value = Object.values(req.body);
    const key = Object.keys(req.body);
    try {
      const updatedParcel = await updateParcel(key[0], value[0], con);
      const packages = await getParcels(username)
      res.json({ package: updatedParcel.rows[0], packages: packages.rows });
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

/**
 * @swagger
 * /parcels/{id}/presentLocation:
 *   put:
 *     summary: The end point to update the parcel order present location.
 *     parameters:
 *       - name: parcelId
 *         in: path
 *         required: true
 *         schema:
 *           type : integer
 *           format: int64
 *           minimum: 1
 *     requestBody:
 *       description: The new location of the parcel order.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/parcelData' 
*/

// UPDATE the status of the user's parcel
updateRouter.put(
  '/parcels/:id/presentLocation',
  verifyAdminToken,
  async (req, res) => {
    const token = req.headers.authorization;
    const {username} = jwt.decode(token);
    const { id } = req.params;
    const con = parseInt(id);
    const value = Object.values(req.body);
    const key = Object.keys(req.body);
    try {
      const updatedParcel = await updateParcel(key[0], value[0], con);
      const packages = await getParcels(username)
      res.json({ package: updatedParcel.rows[0], packages: packages.rows });
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

export default updateRouter;
