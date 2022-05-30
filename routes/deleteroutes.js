import { Router } from 'express';
import { verifyToken } from '../authentication/loginauth';
import { deletePackage, client } from '../database/db';

const deleteRouter = Router();

deleteRouter.delete(
  '/parcels/:parcelid/delete', verifyToken,
  async (req, res) => {
    const parcelid = parseInt(req.params.parcelid);
    try {
      const deletedParcel = await deletePackage(parcelid);
      if (deletedParcel.rowCount !== 0) {
        const packages = await client.query('SELECT * FROM packages');
        res.json({ packages: packages.rows, package: deletedParcel.rows[0] });
      }
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

export default deleteRouter;
