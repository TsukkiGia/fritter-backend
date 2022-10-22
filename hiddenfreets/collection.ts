import type {HydratedDocument} from 'mongoose';
import type {HiddenFreet} from './model';
import HiddenFreetModel from './model';

class HiddenFreetCollection {
  static async hideFreet(hider: string, hiddenItem: string): Promise<HydratedDocument<HiddenFreet>> {
    const hiddenFreet = new HiddenFreetModel({hider, hiddenItem});
    await hiddenFreet.save();
    return hiddenFreet;
  }

  static async findHiddenFreetbyItemAndUser(hider: string, hiddenItem: string): Promise<Array<HydratedDocument<HiddenFreet>>> {
    return HiddenFreetModel.findOne({hider, hiddenItem});
  }

  static async removeHiddenFreetsbyItem(hiddenItem: string): Promise<boolean> {
    const hiddenFreet = await HiddenFreetModel.deleteMany({hiddenItem});
    return hiddenFreet !== null;
  }

  static async findHiddenFreetsForUser(hider: string): Promise<Array<HydratedDocument<HiddenFreet>>> {
    return HiddenFreetModel.find({hider});
  }
}
export default HiddenFreetCollection;
