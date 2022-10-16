import type {NextFunction, Request, Response} from 'express';
import {Router} from 'express';
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
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId === undefined) {
      next();
      return;
    }

    const likesForFreet = await LikeCollection.getLikesOfItem(req.query.freetId as string);
    const response = likesForFreet.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

/**
 * Checks if the current user has liked a Freet
 *
 * @name GET /api/likes/hasCurrentUserLiked?freetId=id
 *
 * @return Boolean that indicates if the current user has liked a specific Freet
 */
router.get(
  '/hasCurrentUserLikedFreet',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freetId === undefined) {
      next();
      return;
    }

    const like = await LikeCollection.findLike(req.session.userId as string, req.query.freetId as string);
    res.status(200).json(like !== null);
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

