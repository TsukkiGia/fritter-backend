import type {Request, Response, NextFunction} from 'express';
import NotificationCollection from './collection';
import UserCollection from '../user/collection';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';

const doesReceivingUserExist = async (req: Request, res: Response, next: NextFunction) => {
  const receivingUser = req.body.notificationReceiver as string;
  if (!receivingUser) {
    res.status(400).json({
      error: 'Provided receiving user id must be nonempty.'
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(receivingUser);
  const user = validFormat ? await UserCollection.findOneByUserId(receivingUser) : '';
  if (!user) {
    res.status(404).json({
      error: `A user with ID ${receivingUser} does not exist.`
    });
    return;
  }

  next();
};

const doesNotificationExist = async (req: Request, res: Response, next: NextFunction) => {
  const {notificationId} = req.params;
  if (!notificationId) {
    res.status(400).json({
      error: 'Provided notification id must be nonempty.'
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(notificationId);
  const notification = validFormat ? await NotificationCollection.findOneByNotificationId(new Types.ObjectId(notificationId)) : '';
  if (!notification) {
    res.status(404).json({
      error: `A notification with ID ${notificationId} does not exist.`
    });
    return;
  }

  next();
};

const isNotificationModifierValid = async (req: Request, res: Response, next: NextFunction) => {
  const {notificationId} = req.params;
  const notification = await NotificationCollection.findOneByNotificationId(new Types.ObjectId(notificationId));
  const userId = notification.notificationReceiver.toString();
  if (req.session.userId !== userId) {
    res.status(403).json({
      error: 'Cannot modify other users\' notifications.'
    });
    return;
  }

  next();
};

const isNotificationFollowRequestAnswerValid = async (req: Request, res: Response, next: NextFunction) => {
  const hasAcceptedFollowRequest = req.body.hasAcceptedFollowRequest as string;
  if (hasAcceptedFollowRequest !== 'true' && hasAcceptedFollowRequest !== 'false') {
    res.status(400).json({
      error: 'Notification follow request response is invalid. Must be true or false.'
    });
    return;
  }

  next();
};

const isNotificationFormattedWell = async (req: Request, res: Response, next: NextFunction) => {
  const notificationType = req.body.notificationType as string;
  const notificationFreet = req.body.notificationFreet as string;

  if (!notificationType) {
    res.status(400).json({
      error: 'Provided notification type must be nonempty.'
    });
    return;
  }

  if (notificationType === 'follow' || notificationType === 'followrequest') {
    if (notificationFreet) {
      res.status(400).json({
        error: 'Follow notification does not require notification freet.'
      });
      return;
    }
  } else if (notificationType === 'like' || notificationType === 'refreet' || notificationType === 'comment') {
    if (!notificationFreet) {
      res.status(400).json({
        error: 'Provided notification freet must be nonempty.'
      });
      return;
    }

    const isValid = Types.ObjectId.isValid(notificationFreet);
    const freet = isValid ? await FreetCollection.findOne(notificationFreet) : '';
    if (!freet) {
      res.status(404).json({
        error: 'Provided notification freet does not exist.'
      });
      return;
    }
  } else {
    res.status(400).json({
      error: 'Provided notification type is invalid.'
    });
    return;
  }

  next();
};

export {
  doesNotificationExist,
  doesReceivingUserExist,
  isNotificationFormattedWell,
  isNotificationModifierValid,
  isNotificationFollowRequestAnswerValid
};
