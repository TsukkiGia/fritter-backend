import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as refreetValidator from '../refreet/middleware';
import * as util from './util';
import RefreetCollection from './collection';

const router = express.Router();

router.get(
  '/',
  [
    freetValidator.isLikedFreetExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId === undefined) {
      next();
      return;
    }

    const refreetsForFreet = await RefreetCollection.getRefreetsofItem(req.query.freetId as string);
    const response = refreetsForFreet.map(util.constructRefreetResponse);
    res.status(200).json(response);
  }
);

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isLikedFreetExists,
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
    freetValidator.isLikedFreetExists,
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

export {router as refreetRouter};
