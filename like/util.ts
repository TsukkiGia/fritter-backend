import type {HydratedDocument} from 'mongoose';
import type {Like, PopulatedLike} from './model';

type LikeResponse = {
  _id: string;
  liker: string;
  likedItem: string;
};

const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse =>
//   Const likeCopy: PopulatedLike = {
//     ...like.toObject({
//       versionKey: false
//     })
//   };
//   const {username} = likeCopy.likerUser;
  ({
    _id: like._id.toString(),
    liker: like.liker,
    likedItem: like.likedItem
  });
export {
  constructLikeResponse
};
