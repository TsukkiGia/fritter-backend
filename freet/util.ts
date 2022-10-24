import type {Types, HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Freet, PopulatedFreet} from '../freet/model';
import UserCollection from '../user/collection';

// Update this if you add a property to the Freet type!
type FreetResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
  timeOfDeletion: string;
  parentFreet: string;
  viewers: string[];
  commentPropagation: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

async function hideFreetsFromPrivateUsers(freets: Freet[]): Promise<Freet[]> {
  const filtered_freets = [];
  const usersPromises = [];
  for (const freet of freets) {
    const {authorId} = freet;
    usersPromises.push(UserCollection.findOneByUserId(authorId));
  }

  const userToPrivate = new Map<string, boolean>();
  const users = await Promise.all(usersPromises);
  for (const user of users) {
    userToPrivate.set(user._id.toString(), user.isPrivate);
  }

  for (const freet of freets) {
    if (!userToPrivate.get(freet.authorId.toString())) {
      filtered_freets.push(freet);
    }
  }

  return filtered_freets;
}

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Freet>} freet - A freet
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructFreetResponse = (freet: HydratedDocument<Freet>): FreetResponse => {
  const freetCopy: PopulatedFreet = {
    ...freet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = freetCopy.authorId;
  delete freetCopy.authorId;
  return {
    ...freetCopy,
    _id: freetCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freet.dateCreated),
    dateModified: formatDate(freet.dateModified),
    timeOfDeletion: (freet.timeOfDeletion === null || freet.timeOfDeletion === undefined) ? '' : formatDate(freet.timeOfDeletion),
    parentFreet: (freetCopy.parentFreet === null || freetCopy.parentFreet === undefined) ? '' : freetCopy.parentFreet.toString(),
    viewers: freetCopy.viewers,
    commentPropagation: (freetCopy.commentPropagation === null || freetCopy.commentPropagation === undefined) ? '' : freetCopy.commentPropagation.toString()
  };
};

export {
  constructFreetResponse,
  hideFreetsFromPrivateUsers
};
