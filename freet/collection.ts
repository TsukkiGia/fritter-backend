
import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      viewers: []
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  static async addOneComment(authorId: Types.ObjectId | string, content: string, parentFreet: string, commentPropagation: boolean): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      viewers: [],
      parentFreet,
      commentPropagation
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  static async findManyByContents(contents: string): Promise<Array<HydratedDocument<Freet>>> {
    const regex = new RegExp(contents, 'i');
    return FreetModel.find({content: {$regex: regex}, timeOfDeletion: null});
  }

  static async findCommentsOfFreet(parentFreet: string): Promise<Array<HydratedDocument<Freet>>> {
    return FreetModel.find({parentFreet, timeOfDeletion: null});
  }

  // Gets freets that were deleted after a specific date (will be 30 days before)
  static async findDeletedFreetsForBin(userId: string): Promise<Array<HydratedDocument<Freet>>> {
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() - 30);
    return FreetModel.find({authorId: userId,
      timeOfDeletion: {
        $gt: deadlineDate
      }});
  }

  // Gets freets that are not deleted before a specific date
  static async findFreetsForANBDeletion(userId: string, deadlineDate: Date): Promise<boolean> {
    const freets = await FreetModel.updateMany({authorId: userId, timeOfDeletion: null,
      dateCreated: {
        $lt: deadlineDate
      }}, {$set: {timeOfDeletion: new Date()}});
    return freets !== null;
  }

  static async updateCommentFreetsDeletion(parentFreetID: string, toDelete: boolean): Promise<boolean> {
    if (!toDelete) {
      const freets = await FreetModel.updateMany({parentFreet: parentFreetID}, {$set: {timeOfDeletion: null}});
      return freets !== null;
    }

    const freets = await FreetModel.updateMany({parentFreet: parentFreetID}, {$set: {timeOfDeletion: new Date()}});
    return freets !== null;
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId, timeOfDeletion: null}).populate('authorId');
  }

  static async findOneExisted(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetModel.find({timeOfDeletion: null}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freets in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id, timeOfDeletion: null, commentPropagation: {$ne: false}}).populate('authorId');
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string, toDelete: string, viewerId: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.dateModified = new Date();

    if (content) {
      freet.content = content;
    }

    if (viewerId) {
      const {viewers} = freet;
      if (!viewers.includes(viewerId)) {
        viewers.push(viewerId);
        freet.viewers = viewers;
      }
    }

    if (toDelete === 'true') {
      freet.timeOfDeletion = new Date();
    } else if (toDelete === 'false') {
      freet.timeOfDeletion = null;
    }

    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }
}

export default FreetCollection;
