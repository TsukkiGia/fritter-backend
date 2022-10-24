import type {HydratedDocument} from 'mongoose';
import type {Refreet} from './model';
import RefreetModel from './model';

class RefreetCollection {
  static async addRefreet(refreeter: string, refreetedItem: string): Promise<HydratedDocument<Refreet>> {
    const refreet = new RefreetModel({refreeter, refreetedItem, freetDeleted: false});
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

  static async findRefreetsByRefreeter(refreeter: string): Promise<Array<HydratedDocument<Refreet>>> {
    return RefreetModel.find({refreeter, freetDeleted: false});
  }

  static async updateRefreetDeletionStatus(refreetedItem: string, deletionStatus: boolean): Promise<boolean> {
    const refreets = await RefreetModel.updateMany({refreetedItem}, {$set: {freetDeleted: deletionStatus}});
    return refreets !== null;
  }
}

export default RefreetCollection;
