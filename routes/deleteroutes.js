import { Router } from 'express';
import { verifyToken } from '../authentication/loginauth';
import { deleteParcel, getParcels } from '../database/db';

const deleteRouter = Router();

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
 * /parcels/{id}/status:
 *   put:
 *     summary: The end point to delete parcel order.
 *     parameters:
 *       - name: parcelId
 *         in: path
 *         required: true
 *         schema:
 *           type : integer
 *           format: int64
 *           minimum: 1
 *     responses:
 *       200:
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
