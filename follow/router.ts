import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as followValidator from './middleware';
import * as util from './util';
import FollowCollection from './collection';
import UserCollection from '../user/collection';

const router = express.Router();

router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const followingList = await FollowCollection.getFollowingList(req.session.userId);
    const response = followingList.map(util.constructFollowResponse);
    res.status(200).json(response);
  }
);

router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.doesRequestedUserExist
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const follow = await FollowCollection.respondToFollowRequest(req.session.userId, req.body.requestedUserId, req.body.hasAcceptedFollowRequest === 'true');
    const message = req.body.hasAcceptedFollowRequest === 'true' ? 'You successfully accepted a follow request' : 'You successfully rejected a follow request';
    res.status(201).json({
      message,
      follow: util.constructFollowResponse(follow)
    });
  }
);

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.doesUserToBeFollowedExist,
    followValidator.isCurrentUserNotFollowing
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const followedUser = await UserCollection.findOneByUserId(req.body.followedUser as string);
    const follow = await FollowCollection.followUser(req.body.followedUser, userId, followedUser.isPrivate);
    const message = followedUser.isPrivate ? 'You successfully made a follow request' : 'You followed a user successfully.';
    res.status(201).json({
      message,
      follow: util.constructFollowResponse(follow)
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
    followValidator.doesUserToBeFollowedExist,
    followValidator.isCurrentUserFollowing
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    await FollowCollection.unfollowUser(req.query.followedUser as string, userId);
    res.status(200).json({
      message: 'You unfollowed a user successfully.'
    });
  }
);

export {router as followRouter};

