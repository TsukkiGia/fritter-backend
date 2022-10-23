import type {NextFunction, Request, Response, Router} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as hiddenFreetValidator from './middleware';
import * as util from './util';
import HiddenFreetCollection from './collection';

const router = express.Router();

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.doesFreetExistGeneral,
    hiddenFreetValidator.isFreetHidden
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const hiddenFreet = await HiddenFreetCollection.hideFreet(userId, req.body.freetId);
    res.status(201).json({
      message: 'You have a hidden a freet successfully.',
      hiddenFreet: util.constructHiddenFreetResponse(hiddenFreet)
    });
  }
);

router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const freets = await HiddenFreetCollection.findHiddenFreetsForUser(req.session.userId);
    const response = freets.map(util.constructHiddenFreetResponse);
    res.status(200).json(response);
  }
);

export {router as hiddenFreetRouter};
