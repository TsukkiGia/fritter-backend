import type {HydratedDocument} from 'mongoose';
import type {Like} from './model';

type LikeResponse = {
  _id: string;
  liker: string;
  likedItem: string;
};

const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse =>

  ({
    _id: like._id.toString(),
    liker: like.liker.toString(),
    likedItem: like.likedItem.toString()
  });
export {
  constructLikeResponse
};
