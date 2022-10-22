import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Downvote = {
  _id: Types.ObjectId;
  downvoter: Types.ObjectId;
  downvotedItem: Types.ObjectId;
};

const DownvoteSchema = new Schema({
  downvoter: {
    type: Schema.Types.ObjectId,
    required: true
  },
  downvotedItem: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const DownvoteModel = model<Downvote>('Downvote', DownvoteSchema);
export default DownvoteModel;
