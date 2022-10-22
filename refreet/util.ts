import type {HydratedDocument} from 'mongoose';
import type {Refreet} from './model';

type RefreetResponse = {
  _id: string;
  refreeter: string;
  refreetedItem: string;
};

const constructRefreetResponse = (refreet: HydratedDocument<Refreet>): RefreetResponse =>
  ({
    _id: refreet._id.toString(),
    refreeter: refreet.refreeter.toString(),
    refreetedItem: refreet.refreetedItem.toString()
  });

export {
  constructRefreetResponse
};
