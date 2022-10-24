import type {Request, Response, NextFunction} from 'express';
import FollowCollection from './collection';
import UserCollection from '../user/collection';
import {Types} from 'mongoose';

const isCurrentUserFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const follow = await FollowCollection.findFollowRecord(req.session.userId, req.query.followedUser as string);
  if (!follow) {
    res.status(400).json({
      error: {
        followNotFound: `Current user has not followed user with ID ${req.query.followedUser as string}`
      }
    });
    return;
  }

  next();
};

const isCurrentUserNotFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const follow = await FollowCollection.findFollowRecord(req.session.userId, req.body.followedUser as string);
  if (follow) {
    res.status(400).json({
      error: {
        followNotFound: `Current user has already followed user with ID ${req.body.followedUser as string}`
      }
    });
    return;
  }

  next();
};

const doesUserToBeFollowedExist = async (req: Request, res: Response, next: NextFunction) => {
  const followedUser = (req.query.followedUser as string) ?? (req.body.followedUser as string);
  if (!followedUser) {
    res.status(400).json({
      error: 'Provided followed user id must be nonempty.'
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(followedUser);
  const user = validFormat ? await UserCollection.findOneByUserId(followedUser) : '';
  if (!user) {
    res.status(404).json({
      error: `A user with ID ${followedUser} does not exist.`
    });
    return;
  }

  next();
};

const doesRequestedUserExist = async (req: Request, res: Response, next: NextFunction) => {
  const followedUser = req.body.requestedUserId as string;
  if (!followedUser) {
    res.status(400).json({
      error: 'Provided followed user id must be nonempty.'
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(followedUser);
  const user = validFormat ? await UserCollection.findOneByUserId(followedUser) : '';
  if (!user) {
    res.status(404).json({
      error: `A user with ID ${followedUser} does not exist.`
    });
    return;
  }

  next();
};

export {
  isCurrentUserFollowing,
  isCurrentUserNotFollowing,
  doesUserToBeFollowedExist,
  doesRequestedUserExist
};
