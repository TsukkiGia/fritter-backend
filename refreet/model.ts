import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Refreet = {
  _id: Types.ObjectId;
  refreeter: string;
  refreetedItem: string;
};

const RefreetSchema = new Schema({
  refreeter: {
    type: String,
    required: true
  },
  refreetedItem: {
    type: String,
    required: true
  }
});

const refreetModel = model<Refreet>('Refreet', RefreetSchema);
export default refreetModel;
