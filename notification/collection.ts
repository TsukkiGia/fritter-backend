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

  static async addFollowNotification(receivingUser: string, sendingUser: string, notifType: string, isFollowRequest: boolean): Promise<HydratedDocument<Notification>> {
    if (isFollowRequest) {
      const notification = new NotificationModel(
        {
          notificationReceiver: receivingUser,
          notificationType: notifType,
          notificationTime: Date.now(),
          notificationSender: sendingUser,
          hasAcceptedFollowRequest: 'received'
        }
      );
      await notification.save();
      return notification;
    }

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

  static async updateFollowRequestNotification(notificationId: Types.ObjectId, response: string): Promise<HydratedDocument<Notification>> {
    const notification = await NotificationModel.findOne({_id: notificationId});
    notification.hasAcceptedFollowRequest = response;
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
