import type {HydratedDocument} from 'mongoose';
import type {Refreet} from './model';
import RefreetModel from './model';

class RefreetCollection {
  static async addRefreet(refreeter: string, refreetedItem: string): Promise<HydratedDocument<Refreet>> {
    const refreet = new RefreetModel({refreeter, refreetedItem});
    await refreet.save();
    return refreet;
  }

  static async removeRefreetByItem(refreetedItem: string): Promise<boolean> {
    const refreet = await RefreetModel.deleteMany({refreetedItem});
    return refreet !== null;
  }

  static async removeRefreetByItemAndUser(refreeter: string, refreetedItem: string) {
    const refreet = await RefreetModel.deleteOne({refreeter, refreetedItem});
    return refreet !== null;
  }

  static async getRefreetsofItem(refreetedItem: string): Promise<Array<HydratedDocument<Refreet>>> {
    return RefreetModel.find({refreetedItem});
  }

  static async findRefreet(refreeter: string, refreetedItem: string): Promise<HydratedDocument<Refreet>> {
    return RefreetModel.findOne({refreeter, refreetedItem});
  }
}

export default RefreetCollection;
