import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Like = {
  _id: Types.ObjectId;
  liker: string;
  likedItem: string;
};

export type PopulatedLike = {
  _id: Types.ObjectId;
  likerUser: User;
  likedItem: string;
};

const LikeSchema = new Schema({
  liker: {
    type: String,
    required: true
  },
  likedItem: {
    type: String,
    required: true
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
