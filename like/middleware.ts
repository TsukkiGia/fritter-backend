import type {Request, Response, NextFunction} from 'express';
import LikeCollection from '../like/collection';

/**
 * Checks if the current user has already liked a given Freet
 */

const doesLikeExist = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findLike(req.session.userId, req.query.freetId as string);
  if (!like) {
    res.status(400).json({
      error: {
        likeNotFound: `Current user has not liked Freet with freet ID ${req.query.freetId as string}`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the given Freet has not been already liked by a given user
 */
const doesLikeNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findLike(req.session.userId, req.body.freetId);
  if (like) {
    res.status(400).json({
      error: {
        likeNotFound: `Current user has already liked Freet with freet ID ${req.body.freetId as string}`
      }
    });
    return;
  }

  next();
};

export {
  doesLikeExist,
  doesLikeNotExist
};

