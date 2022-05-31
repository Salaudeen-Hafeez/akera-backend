import { Router } from 'express';
import { getParcels, getUserParcels, parcelExist } from '../database/db';
import {verifyAdminToken, verifyToken } from '../authentication/loginauth';

const getRouter = Router();

// GET all the users' packages
getRouter.get('/parcels', verifyAdminToken, async (req, res) => {
  try {
    const packages = await getParcels();
    res.json(packages.rows);
  } catch (error) {
    res.status(400).json({ errMessage: error.message });
  }
});

// GET all packages of a single user
getRouter.get('/parcels/user', verifyToken,
  async (req, res) => {
    try {
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
