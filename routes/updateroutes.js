import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { getToken, verifyUserToken, verifyAdminToken } from '../authentication/loginauth';
import { updateParcel, getUserParcels, getParcels } from '../database/db';

const updateRouter = Router();

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

/**
 * @swagger
 * /parcels/{id}/destination:
 *   put:
 *     summary: The end point to hange the parcel order destination.
 *     tags:
 *        - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
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
 *               _destination:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Destination updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/parcelData' 
*/

// UPDATE the status of the user's parcel
updateRouter.put(
  '/parcels/:id/destination',
  verifyUserToken,
  async (req, res) => {
    const {username}= jwt.decode(getToken(req))
    const con = parseInt(req.params.id);
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
 *     tags:
 *        - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
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
 *               _status:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Status updated successfully.
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
    const con = parseInt(req.params.id);
    const value = Object.values(req.body);
    const key = Object.keys(req.body);
    try {
      let updatedParcel
      if (key.length === 1){
        updatedParcel = await updateParcel(key[0], value[0], con);
      }else if (key.length === 2){
        updatedParcel = await updateParcel(key[0], value[0], con);
        updatedParcel = await updateParcel(key[1], value[1], con);
      }
      const packages = await getParcels()
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
 *     tags:
 *        - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
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
 *               _location:
 *                 type: string
 *     responses:
 *       '200':
 *         description: The location updated successfully.
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
    const con = parseInt(req.params.id);
    const value = Object.values(req.body);
    const key = Object.keys(req.body);
    try {
      const updatedParcel = await updateParcel(key[0], value[0], con);
      const packages = await getParcels()
      res.json({ package: updatedParcel.rows[0], packages: packages.rows });
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

export default updateRouter;
