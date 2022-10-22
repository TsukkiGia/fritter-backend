import FollowCollection from '../follow/collection';
import type {HydratedDocument, Types} from 'mongoose';
import type {Notification} from './model';
import NotificationModel from './model';

class NotificationCollection {
  // For like comment, refreet
  static async addFreetNotification(receivingUser: string, sendingUser: string, notifFreet: string, notifType: string): Promise<HydratedDocument<Notification>> {
    const notification = new NotificationModel(
      {
        notificationReceiver: receivingUser,
        notificationType: notifType,
        notificationTime: Date.now(),
        notificationSender: sendingUser,
        notificationFreet: notifFreet
      }
    );
    await notification.save();
    return notification;
  }

  static async addFollowNotification(receivingUser: string, sendingUser: string, notifType: string): Promise<HydratedDocument<Notification>> {
    const notification = new NotificationModel(
      {
        notificationReceiver: receivingUser,
        notificationType: notifType,
        notificationTime: Date.now(),
        notificationSender: sendingUser
      }
    );
    await notification.save();
    return notification;
  }

  static async respondToFollowRequestNotification(notificationId: Types.ObjectId, response: boolean): Promise<HydratedDocument<Notification>> {
    const notification = await NotificationModel.findOne({_id: notificationId});
    const {notificationReceiver, notificationSender} = notification;
    notification.hasAcceptedFollowRequest = response;
    if (response) {
      await FollowCollection.followUser(notificationReceiver.toString(), notificationSender.toString());
    }

    await notification.save();
    return notification;
  }

  static async getNotificationsForUser(receivingUser: string): Promise<Array<HydratedDocument<Notification>>> {
    return NotificationModel.find({notificationReceiver: receivingUser});
  }

  static async findOneByNotificationId(notificationId: Types.ObjectId): Promise<HydratedDocument<Notification>> {
    return NotificationModel.findOne({_id: notificationId});
  }
}

export default NotificationCollection;
