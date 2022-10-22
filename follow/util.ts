import type {HydratedDocument} from 'mongoose';
import type {Follow} from './model';

type FollowResponse = {
  _id: string;
  follower: string;
  followedUser: string;
};

const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse =>
  ({
    _id: follow._id.toString(),
    follower: follow.follower.toString(),
    followedUser: follow.followedUser.toString()
  });
export {
  constructFollowResponse
};
