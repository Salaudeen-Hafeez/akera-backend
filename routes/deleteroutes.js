import { Router } from 'express';
import { verifyToken } from '../authentication/loginauth';
import { deleteParcel, getParcels } from '../database/db';

const deleteRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Parcels
 *      description: Access to parcels orders
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     parcelData:
 *       properties:
 *         username:
 *           type: string
 *         name:
 *           type: string
 *         location:
 *           type: string
 *         destination:
 *           type: string
 *         sender:
 *           type: string
 *         reciever:
 *           type: string
 *         frajile:
 *           type: string
 *         status:
 *           type: string
 *         cost:
 *           type: string
 *         tracking_id:
 *           type: string
 *         weight:
 *           type: string
 */

/**
 * @swagger
 * /parcels/{id}/status:
 *   delete:
 *     summary: The end point to delete parcel order.
 *     tags:
 *        -Parcels
 *     parameters:
 *       - name: parcelId
 *         in: path
 *         required: true
 *         schema:
 *           type : integer
 *           format: int64
 *           minimum: 1
 *     responses:
 *       '200':
 *         description: Parcel deleted.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/parcelData' 
 */

deleteRouter.delete(
  '/parcels/:parcelid/delete', verifyToken,
  async (req, res) => {
    const parcelid = parseInt(req.params.parcelid);
    try {
      const deletedParcel = await deleteParcel(parcelid);
      if (deletedParcel.rowCount !== 0) {
        const packages = await getParcels();
        res.json({ packages: packages.rows, package: deletedParcel.rows[0] });
      }
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

export default deleteRouter;
