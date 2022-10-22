import type {Request, Response, NextFunction} from 'express';
import NotificationCollection from './collection';
import UserCollection from '../user/collection';
import {Types} from 'mongoose';

const doesReceivingUserExist = async (req: Request, res: Response, next: NextFunction) => {
  const receivingUser = req.body.notificationReceiver as string;
  if (!receivingUser) {
    res.status(400).json({
      error: 'Provided receiving user username must be nonempty.'
    });
    return;
  }

  if (!Types.ObjectId.isValid(receivingUser)) {
    res.status(400).json({
      error: 'Provided receiving user ID is not a valid ID.'
    });
    return;
  }

  const user = await UserCollection.findOneByUserId(receivingUser);
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

  if (!Types.ObjectId.isValid(notificationId)) {
    res.status(400).json({
      error: 'Provided Notification ID is not a valid ID.'
    });
  }

  const notification = await NotificationCollection.findOneByNotificationId(new Types.ObjectId(notificationId));
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
  const userId = notification.notificationReceiver;
  if (req.session.userId !== userId) {
    res.status(403).json({
      error: 'Cannot modify other users\' notifications.'
    });
    return;
  }

  next();
};

const isNotificationStatusValid = async (req: Request, res: Response, next: NextFunction) => {
  const hasAcceptedFollowRequest = req.body.hasAcceptedFollowRequest as string;
  if (hasAcceptedFollowRequest !== 'true' && hasAcceptedFollowRequest !== 'false') {
    res.status(403).json({
      error: 'Notification status is invalid.'
    });
    return;
  }

  next();
};

const isNotificationFormattedWell = async (req: Request, res: Response, next: NextFunction) => {
  const notificationType = req.body.notificationType as string;
  const notificationReceiver = req.body.notificationReceiver as string;
  const notificationFreet = req.body.notificationFreet as string;

  if (!notificationType) {
    res.status(400).json({
      error: 'Provided notification type must be nonempty.'
    });
    return;
  }

  if (!notificationReceiver) {
    res.status(400).json({
      error: 'Provided notification receiver must be nonempty.'
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
  } else {
    res.status(403).json({
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
  isNotificationStatusValid
};
