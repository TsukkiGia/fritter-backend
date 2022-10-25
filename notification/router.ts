import type {NextFunction, Request, Response, Router} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as notificationValidator from './middleware';
import * as util from './util';
import {Types} from 'mongoose';
import NotificationCollection from './collection';

const router = express.Router();

router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    notificationValidator.doesReceivingUserExist,
    notificationValidator.isNotificationFormattedWell
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const notificationType = req.body.notificationType as string;
    const notificationReceiver = req.body.notificationReceiver as string;
    const notificationFreet = req.body.notificationFreet as string;
    if (notificationType === 'follow' || notificationType === 'followrequest') {
      const isFollowRequest = notificationType === 'followrequest';
      const notification = await NotificationCollection.addFollowNotification(notificationReceiver, userId, notificationType, isFollowRequest);
      res.status(201).json({
        message: `You successfully made a ${notificationType} notification.`,
        notification: util.constructFollowNotificationResponse(notification)
      });
    } else if (notificationType === 'like' || notificationType === 'refreet' || notificationType === 'comment') {
      const notification = await NotificationCollection.addFreetNotification(notificationReceiver, userId, notificationFreet, notificationType);
      res.status(201).json({
        message: `You successfully made a ${notificationType} notification.`,
        notification: util.constructFreetNotificationResponse(notification)
      });
    }
  }
);

router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const allNotifications = await NotificationCollection.getNotificationsForUser(userId);
    const responses = [];
    for (const notification of allNotifications) {
      const {notificationType} = notification;
      if (notificationType === 'follow' || notificationType === 'followrequest') {
        responses.push(util.constructFollowNotificationResponse(notification));
      } else if (notificationType === 'like' || notificationType === 'refreet' || notificationType === 'comment') {
        responses.push(util.constructFreetNotificationResponse(notification));
      }
    }

    res.status(200).json(responses);
  }
);

router.put(
  '/:notificationId?',
  [
    userValidator.isUserLoggedIn,
    notificationValidator.doesNotificationExist,
    notificationValidator.isNotificationModifierValid,
    notificationValidator.isNotificationFollowRequestAnswerValid
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const notification = await NotificationCollection.updateFollowRequestNotification(new Types.ObjectId(req.params.notificationId), req.body.hasAcceptedFollowRequest);
    res.status(200).json({
      message: `You responded ${req.body.hasAcceptedFollowRequest as string} to follow request successfully.`,
      notification: util.constructFollowNotificationResponse(notification)
    });
  }
);
export {router as notificationRouter};
