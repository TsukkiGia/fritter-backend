import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as likeValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import LikeCollection from './collection';

const router = express.Router();

/**
 * Gets likes for a particular Freet
 *
 * @name GET /api/likes?freetId=id
 *
 * @return {LikeResponse[]} - A list of all the likes on the specific Freet
 */
router.get(
  '/',
  [
    freetValidator.doesFreetExistGeneral
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const likesForFreet = await LikeCollection.getLikesOfItem(req.query.freetId as string);
    const response = likesForFreet.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Posts a like by the current user for a particular Freet
 *
 * @name POST /api/likes
 *
 * @param {string} freetId - The id of the Freet being liked
 * @return {LikeResponse}
 */

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.doesFreetExistGeneral,
    likeValidator.doesLikeNotExist
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const like = await LikeCollection.addLike(userId, req.body.freetId);
    res.status(201).json({
      message: 'You liked a freet successfully.',
      like: util.constructLikeResponse(like)
    });
  }
);

/**
 * Deletes a like by a user for a particular Freet
 *
 * @name DELETE /api/likes?freetId=id
 *
 * @param {string} freetId - The id of the Freet being unliked
 * @return {string} - A success message
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.doesFreetExistGeneral,
    likeValidator.doesLikeExist
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    await LikeCollection.removeLikebyItemAndUser(req.session.userId as string, req.query.freetId as string);
    res.status(200).json({
      message: 'Your like was removed successfully.'
    });
  }
);

export {router as likeRouter};

