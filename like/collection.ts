import type {HydratedDocument} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

class LikeCollection {
  static async addLike(liker: string, likedItem: string): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({liker, likedItem});
    await like.save();
    return like;
  }

  static async removeLikebyItem(likedItem: string): Promise<boolean> {
    const like = await LikeModel.deleteMany({likedItem});
    return like !== null;
  }

  static async removeLikebyItemAndUser(liker: string, likedItem: string): Promise<boolean> {
    const like = await LikeModel.deleteOne({likedItem, liker});
    return like !== null;
  }

  static async getLikesOfItem(likedItem: string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({likedItem});
  }

  static async findLike(liker: string, likedItem: string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({liker, likedItem});
  }
}

export default LikeCollection;
