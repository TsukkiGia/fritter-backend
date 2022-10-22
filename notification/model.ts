
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Notification = {
  _id: Types.ObjectId;
  notificationReceiver: string;
  notificationType: string;
  notificationTime: Date;
  notificationSender: string;
  notificationFreet: string;
  hasAcceptedFollowRequest: boolean;
};

const NotificationSchema = new Schema({
  notificationReceiver: {
    type: String,
    required: true
  },
  notificationType: {
    type: String,
    required: true
  },
  notificationTime: {
    type: Date,
    required: true
  },
  notificationSender: {
    type: String,
    required: true
  },
  notificationFreet: {
    type: String
  },
  hasAcceptedFollowRequest: {
    type: Boolean
  }
});

const NotificationModel = model<Notification>('Notification', NotificationSchema);
export default NotificationModel;
