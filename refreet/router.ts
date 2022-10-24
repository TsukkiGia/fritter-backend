import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as refreetValidator from '../refreet/middleware';
import * as util from './util';
import RefreetCollection from './collection';
import UserCollection from '../user/collection';
import {Types} from 'mongoose';

const router = express.Router();

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId !== undefined) {
      next();
      return;
    }

    const refreeter = req.query.userId as string;
    if (!refreeter) {
      res.status(400).json({
        error: 'Provided id of user who requested to follow must be nonempty.'
      });
      return;
    }

    const validFormat = Types.ObjectId.isValid(refreeter);
    const user = validFormat ? await UserCollection.findOneByUserId(refreeter) : '';
    if (!user) {
      res.status(404).json({
        error: `A user with ID ${refreeter} does not exist.`
      });
      return;
    }

    const refreetsForUser = await RefreetCollection.findRefreetsByRefreeter(req.query.userId as string);
    const response = refreetsForUser.map(util.constructRefreetResponse);
    res.status(200).json(response);
  },
  [
    freetValidator.doesFreetExistGeneral
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const refreetsForFreet = await RefreetCollection.getRefreetsofItem(req.query.freetId as string);
    const response = refreetsForFreet.map(util.constructRefreetResponse);
    res.status(200).json(response);
  }
);

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.doesFreetExistGeneral,
    refreetValidator.doesRefreetNotExist
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string);
    const refreet = await RefreetCollection.addRefreet(userId, req.body.freetId);
    res.status(201).json({
      message: 'You Refreeted a freet successfully.',
      refreet: util.constructRefreetResponse(refreet)
    });
  }
);

router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.doesFreetExistGeneral,
    refreetValidator.doesRefreetExist
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string);
    await RefreetCollection.removeRefreetByItemAndUser(userId, req.query.freetId as string);
    res.status(201).json({
      message: 'Your Refreet was removed successfully.'
    });
  }
);

router.put(
  '/',
  [
    refreetValidator.refreetDeletionStatus
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const deletionStatus = req.body.deletionStatus === 'true';
    const freetId = req.body.freetId as string;
    await RefreetCollection.updateRefreetDeletionStatus(freetId, deletionStatus);
    res.status(201).json({
      message: 'Multiple refreets were updated successfully.'
    });
  }
);

export {router as refreetRouter};
