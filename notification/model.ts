
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Notification = {
  _id: Types.ObjectId;
  notificationReceiver: Types.ObjectId;
  notificationType: string;
  notificationTime: Date;
  notificationSender: Types.ObjectId;
  notificationFreet: Types.ObjectId;
  hasAcceptedFollowRequest: string;
};

const NotificationSchema = new Schema({
  notificationReceiver: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
    required: true
  },
  notificationFreet: {
    type: Schema.Types.ObjectId
  },
  hasAcceptedFollowRequest: {
    type: String
  }
});

const NotificationModel = model<Notification>('Notification', NotificationSchema);
export default NotificationModel;
