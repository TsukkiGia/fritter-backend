import type {Request, Response, NextFunction} from 'express';
import HiddenFreetCollection from './collection';

const isFreetHidden = async (req: Request, res: Response, next: NextFunction) => {
  const hiddenFreet = await HiddenFreetCollection.findHiddenFreetbyItemAndUser(req.session.userId, req.body.freetId);
  if (hiddenFreet) {
    res.status(400).json({
      error: {
        freetAlreadyHidden: `Current user has already hidden Freet with freet ID ${req.body.freetId as string}`
      }
    });
    return;
  }

  next();
};

export {
  isFreetHidden
};
