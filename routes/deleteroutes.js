import { Router } from 'express';
import { verifyToken } from '../authentication/loginauth';
import { deleteParcel, getParcels } from '../database/db';

const deleteRouter = Router();

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
