import type {HydratedDocument} from 'mongoose';
import type {Downvote} from './model';
import DownvoteModel from './model';

class DownvoteCollection {
  static async addDownvote(downvoter: string, downvotedItem: string): Promise<HydratedDocument<Downvote>> {
    const downvote = new DownvoteModel({downvoter, downvotedItem});
    await downvote.save();
    return downvote;
  }

  static async removeDownvoteByItem(downvotedItem: string): Promise<boolean> {
    const downvote = await DownvoteModel.deleteMany({downvotedItem});
    return downvote !== null;
  }

  static async removeDownvoteByItemAndUser(downvoter: string, downvotedItem: string): Promise<boolean> {
    const downvote = await DownvoteModel.deleteOne({downvoter, downvotedItem});
    return downvote !== null;
  }

  static async getDownvotesOfItem(downvotedItem: string): Promise<Array<HydratedDocument<Downvote>>> {
    return DownvoteModel.find({downvotedItem});
  }

  static async findDownvote(downvoter: string, downvotedItem: string): Promise<HydratedDocument<Downvote>> {
    return DownvoteModel.findOne({downvoter, downvotedItem});
  }
}

export default DownvoteCollection;
