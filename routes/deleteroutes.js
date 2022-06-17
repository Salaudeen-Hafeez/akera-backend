import { Router } from 'express';
import { verifyAdminToken } from '../authentication/loginauth';
import { deleteParcel, getParcels } from '../database/db';

const deleteRouter = Router();

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
 * /parcels/{id}/delete:
 *   delete:
 *     tags:
 *        - Parcels
 *     summary: Delete parcel order.
 *     security:
 *       - bearerAuth: []
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
 */

deleteRouter.delete(
  '/parcels/:parcelid/delete', verifyAdminToken,
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
