import type {HydratedDocument} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';

class FollowCollection {
  static async followUser(followedUser: string, follower: string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({followedUser, follower});
    await follow.save();
    return follow;
  }

  static async unfollowUser(followedUser: string, follower: string): Promise<boolean> {
    const follow = await FollowModel.deleteOne({followedUser, follower});
    return follow !== null;
  }

  static async getFollowingList(follower: string): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({follower});
  }

  static async findFollowRecord(follower: string, followedUser: string): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({follower, followedUser});
  }
}

export default FollowCollection;
