import type {HydratedDocument} from 'mongoose';
import type {HiddenFreet} from './model';

type HiddenFreetResponse = {
  _id: string;
  hider: string;
  hiddenItem: string;
};

const constructHiddenFreetResponse = (hiddenFreet: HydratedDocument<HiddenFreet>): HiddenFreetResponse =>
  ({
    _id: hiddenFreet._id.toString(),
    hider: hiddenFreet.hider.toString(),
    hiddenItem: hiddenFreet.hiddenItem.toString()
  });
export {
  constructHiddenFreetResponse
};
