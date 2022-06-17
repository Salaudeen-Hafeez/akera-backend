import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { getToken, verifyUserToken, verifyAdminToken } from '../authentication/loginauth';
import { updateParcel, getUserParcels, getParcels } from '../database/db';

const updateRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *      description: Authenticating users
 *   - name: Parcels
 *      description: Access to parcels orders
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     updatDestinationRequest:
 *       type: object
 *       properties:
 *         _destination:
 *           type: string
 *           example: Adewusi street, Fadeyi, Lagos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     updatStatusRequest:
 *       type: object
 *       properties:
 *         _status:
 *           type: string
 *           example: In transit
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     updatLocationRequest:
 *       type: object
 *       properties:
 *         _location:
 *           type: string
 *           example: In transit
 */

/**
 * @swagger
 * /parcels/{id}/destination:
 *   put:
 *     tags:
 *        - Parcels
 *     summary: The end point to hange the parcel order destination.
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
 *             $ref: '#/components/schemas/updatDestinationRequest'
 *     responses:
 *       '200':
 *         description: Destination updated successfully.
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
 *     tags:
 *        - Parcels
 *     summary: The end point to change the parcel order status.
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
 *             $ref: '#/components/schemas/updatStatusRequest'
 *     responses:
 *       '200':
 *         description: Status updated successfully.
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
 *     tags:
 *        - Parcels
 *     summary: The end point to update the parcel order present location.
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
 *             $ref: '#/components/schemas/updatLocationRequest'
 *     responses:
 *       '200':
 *         description: The location updated successfully.
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
