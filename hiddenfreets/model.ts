import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type HiddenFreet = {
  _id: Types.ObjectId;
  hider: Types.ObjectId;
  hiddenItem: Types.ObjectId;
};

const HiddenFreetSchema = new Schema({
  hider: {
    type: Schema.Types.ObjectId,
    required: true
  },
  hiddenItem: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const HiddenFreetModel = model<HiddenFreet>('HiddenFreet', HiddenFreetSchema);
export default HiddenFreetModel;
