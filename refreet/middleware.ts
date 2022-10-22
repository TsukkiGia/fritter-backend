import type {Request, Response, NextFunction} from 'express';
import RefreetCollection from './collection';

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

export {
  doesRefreetExist,
  doesRefreetNotExist
};
