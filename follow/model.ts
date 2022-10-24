import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Follow = {
  _id: Types.ObjectId;
  followedUser: Types.ObjectId;
  follower: Types.ObjectId;
  hasAcceptedFollowRequest: string;
};

const FollowSchema = new Schema({
  followedUser: {
    type: Schema.Types.ObjectId,
    required: true
  },
  follower: {
    type: Schema.Types.ObjectId,
    required: true
  },
  hasAcceptedFollowRequest: {
    type: String
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
