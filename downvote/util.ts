import type {HydratedDocument} from 'mongoose';
import type {Downvote} from './model';

type DownvoteResponse = {
  _id: string;
  downvoter: string;
  downvotedItem: string;
};

const constructDownvoteResponse = (downvote: HydratedDocument<Downvote>): DownvoteResponse =>
  ({
    _id: downvote._id.toString(),
    downvoter: downvote.downvoter.toString(),
    downvotedItem: downvote.downvotedItem.toString()
  });

export {
  constructDownvoteResponse
};
