import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Like = {
  _id: Types.ObjectId;
  liker: Types.ObjectId;
  likedItem: Types.ObjectId;
};

const LikeSchema = new Schema({
  liker: {
    type: Schema.Types.ObjectId,
    required: true
  },
  likedItem: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
