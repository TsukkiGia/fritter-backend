import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Follow = {
  _id: Types.ObjectId;
  followedUser: string;
  follower: string;
};

const FollowSchema = new Schema({
  followedUser: {
    type: String,
    required: true
  },
  follower: {
    type: String,
    required: true
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
