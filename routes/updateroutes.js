import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAdminToken, verifyToken } from '../authentication/loginauth';
import { updateParcel, getUserParcels, getParcels } from '../database/db';

const updateRouter = Router();

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
      let updatedParcel
      updatedParcel = await updateParcel(key[0], value[0], con);
      updatedParcel = await updateParcel(key[1], value[1], con);
      const packages = await getParcels(username)
      res.json({ package: updatedParcel.rows[0], packages: packages.rows });
    } catch (error) {
      res.status(400).json({ errMessage: error.message });
    }
  }
);

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
