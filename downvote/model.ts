import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Downvote = {
  _id: Types.ObjectId;
  downvoter: string;
  downvotedItem: string;
};

const DownvoteSchema = new Schema({
  downvoter: {
    type: String,
    required: true
  },
  downvotedItem: {
    type: String,
    required: true
  }
});

const DownvoteModel = model<Downvote>('Downvote', DownvoteSchema);
export default DownvoteModel;
