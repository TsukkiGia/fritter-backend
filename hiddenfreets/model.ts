import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type HiddenFreet = {
  _id: Types.ObjectId;
  hider: string;
  hiddenItem: string;
};

const HiddenFreetSchema = new Schema({
  hider: {
    type: String,
    required: true
  },
  hiddenItem: {
    type: String,
    required: true
  }
});

const HiddenFreetModel = model<HiddenFreet>('HiddenFreet', HiddenFreetSchema);
export default HiddenFreetModel;
