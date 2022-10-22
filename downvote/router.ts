import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as downvoteValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import DownvoteCollection from './collection';

const router = express.Router();

router.get('/',
  [
    freetValidator.doesFreetExistGeneral
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const downvotesForFreet = await DownvoteCollection.getDownvotesOfItem(req.query.freetId as string);
    const response = downvotesForFreet.map(util.constructDownvoteResponse);
    res.status(200).json(response);
  });

router.post('/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.doesFreetExistGeneral,
    downvoteValidator.doesDownvoteNotExist
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const downvote = await DownvoteCollection.addDownvote(userId, req.body.freetId);
    res.status(201).json({
      message: 'You downvoted a freet successfully.',
      downvote: util.constructDownvoteResponse(downvote)
    });
  });

router.delete('/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.doesFreetExistGeneral,
    downvoteValidator.doesDownvoteExist
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    await DownvoteCollection.removeDownvoteByItemAndUser(userId, req.query.freetId as string);
    res.status(201).json({
      message: 'You removed a downvote a freet successfully.'
    });
  });

export {router as downvoteRouter};
