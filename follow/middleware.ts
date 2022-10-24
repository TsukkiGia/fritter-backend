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
    const message = follow.hasAcceptedFollowRequest ? `Current user has already made a request to followed user with ID ${req.body.followedUser as string}` : `Current user has already followed user with ID ${req.body.followedUser as string}`;
    res.status(400).json({
      error: {
        followAlreadyExists: message
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
  const requestedUser = req.body.requestedUserId as string;
  if (!requestedUser) {
    res.status(400).json({
      error: 'Provided id of user who requested to follow must be nonempty.'
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(requestedUser);
  const user = validFormat ? await UserCollection.findOneByUserId(requestedUser) : '';
  if (!user) {
    res.status(404).json({
      error: `A user with ID ${requestedUser} does not exist.`
    });
    return;
  }

  next();
};

const doesRequestExist = async (req: Request, res: Response, next: NextFunction) => {
  const requestedUser = req.body.requestedUserId as string;
  const currentUser = req.session.userId as string;
  const follow = await FollowCollection.findFollowRecord(requestedUser, currentUser);
  if (!follow || follow.hasAcceptedFollowRequest === undefined || follow.hasAcceptedFollowRequest === null) {
    res.status(400).json({
      error: `User ${requestedUser} has not requested a follow.`
    });
    return;
  }

  next();
};

const hasRequestBeenRespondedTo = async (req: Request, res: Response, next: NextFunction) => {
  const requestedUser = req.body.requestedUserId as string;
  const currentUser = req.session.userId as string;
  const follow = await FollowCollection.findFollowRecord(requestedUser, currentUser);
  if (follow.hasAcceptedFollowRequest === 'true' || follow.hasAcceptedFollowRequest === 'false') {
    res.status(400).json({
      error: `You have already responded to user ${requestedUser} follow request.`
    });
    return;
  }

  next();
};

const isValidRequestResponse = async (req: Request, res: Response, next: NextFunction) => {
  const response = req.body.hasAcceptedFollowRequest as string;
  if (!response) {
    res.status(400).json({
      error: 'Your follow request response must nonempty.'
    });
    return;
  }

  if (response !== 'true' && response !== 'false') {
    res.status(400).json({
      error: 'Your follow request response must either be true or false.'
    });
    return;
  }

  next();
};

export {
  isCurrentUserFollowing,
  isCurrentUserNotFollowing,
  doesUserToBeFollowedExist,
  doesRequestedUserExist,
  doesRequestExist,
  hasRequestBeenRespondedTo,
  isValidRequestResponse
};
