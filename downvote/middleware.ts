import type {Request, Response, NextFunction} from 'express';
import DownvoteCollection from './collection';

const doesDownvoteExist = async (req: Request, res: Response, next: NextFunction) => {
  const downvote = await DownvoteCollection.findDownvote(req.session.userId, req.query.freetId as string);
  if (!downvote) {
    res.status(400).json({
      error: {
        downvoteNotFound: `Current user has not downvoted Freet with freet ID ${req.query.freetId as string}`
      }
    });
    return;
  }

  next();
};

const doesDownvoteNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const downvote = await DownvoteCollection.findDownvote(req.session.userId, req.body.freetId);
  if (downvote) {
    res.status(400).json({
      error: {
        downvoteNotFound: `Current user has already downvoted Freet with freet ID ${req.body.freetId as string}`
      }
    });
    return;
  }

  next();
};

export {
  doesDownvoteExist,
  doesDownvoteNotExist
};
