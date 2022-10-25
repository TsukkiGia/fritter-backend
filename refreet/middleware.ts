import type {Request, Response, NextFunction} from 'express';
import RefreetCollection from './collection';
import FreetCollection from '../freet/collection';

const doesRefreetExist = async (req: Request, res: Response, next: NextFunction) => {
  const refreet = await RefreetCollection.findRefreet(req.session.userId, req.query.freetId as string);
  if (!refreet) {
    res.status(400).json({
      error: {
        refreetNotFound: `Current user has not refreeted Freet with freet ID ${req.query.freetId as string}`
      }
    });
    return;
  }

  next();
};

const doesRefreetNotExist = async (req: Request, res: Response, next: NextFunction) => {
  const refreet = await RefreetCollection.findRefreet(req.session.userId, req.body.freetId);
  if (refreet) {
    res.status(400).json({
      error: {
        refreetNotFound: `Current user has already refreeted Freet with freet ID ${req.body.freetId as string}`
      }
    });
    return;
  }

  next();
};

const refreetDeletionStatus = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.deletionStatus) {
    res.status(400).json({
      error: 'Deletion status must be specified.'
    });
    return;
  }

  if (req.body.deletionStatus !== 'true' && req.body.deletionStatus !== 'false') {
    res.status(400).json({
      error: 'Invalid deletion status: must be true or false.'
    });
    return;
  }

  next();
};

export {
  doesRefreetExist,
  doesRefreetNotExist,
  refreetDeletionStatus
};
