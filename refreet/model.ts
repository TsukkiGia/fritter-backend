import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Refreet = {
  _id: Types.ObjectId;
  refreeter: Types.ObjectId;
  refreetedItem: Types.ObjectId;
};

const RefreetSchema = new Schema({
  refreeter: {
    type: Schema.Types.ObjectId,
    required: true
  },
  refreetedItem: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const refreetModel = model<Refreet>('Refreet', RefreetSchema);
export default refreetModel;
