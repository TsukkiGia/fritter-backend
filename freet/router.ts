import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?authorId=id
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
/**
 * Get freets before a certain date.
 *
 * @name GET /api/freets?deadlineDay=DAY&deadlineMonth=MONTH&deadlineYear=YEAR
 *
 * @return {FreetResponse[]} - An array of freets created by user before a certain date
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */

/**
 * Get freets with a certain keyword.
 *
 * @name GET /api/freets?freetContains=keyword
 *
 * @return {FreetResponse[]} - An array of freets created by user with a certain keyword
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined || (req.query.deadlineYear !== undefined || req.query.deadlineMonth !== undefined || req.query.deadlineDay !== undefined) || req.query.freetContains !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.author !== undefined || (req.query.deadlineYear !== undefined || req.query.deadlineMonth !== undefined || req.query.deadlineDay !== undefined)) {
      next();
      return;
    }

    const keyword = req.query.freetContains as string;
    if (!keyword.trim()) {
      res.status(400).json({
        error: 'Keyword must be at least one character long.'
      });
      return;
    }

    if (keyword.length > 140) {
      res.status(413).json({
        error: 'Keyword is too long'
      });
      return;
    }

    const freets = await util.hideFreetsFromPrivateUsers(await FreetCollection.findManyByContents(keyword));
    const response = freets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req.query.deadlineYear !== undefined || req.query.deadlineMonth !== undefined || req.query.deadlineDay !== undefined)) {
      next();
      return;
    }

    const user = await UserCollection.findOneByUsername(req.query.author as string);
    if (!user) {
      res.status(404).json({error: 'User with this username does not exist.'});
      return;
    }

    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidDate
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const deadlineDate = new Date(parseInt(req.query.deadlineYear as string, 10), parseInt(req.query.deadlineMonth as string, 10), (parseInt(req.query.deadlineDay as string, 10), 0, 0, 0, 0));
    const freets = await FreetCollection.findFreetsForANBDeletion(req.session.userId, deadlineDate);
    const response = freets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

router.get(
  '/freetBin',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const freets = await FreetCollection.findDeletedFreetsForBin(userId);
    const response = freets.map(util.constructFreetResponse);
    res.status(200).json(response);
  });

router.get(
  '/:freetId',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const freet = await FreetCollection.findOne(req.params.freetId);
    res.status(200).json({
      message: 'Freet was retrieved successfully.',
      freet: util.constructFreetResponse(freet)
    });
  });

router.get(
  '/:freetId/comments',
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const freets = await FreetCollection.findCommentsOfFreet(req.params.freetId);
    const response = freets.map(util.constructFreetResponse);
    res.status(200).json(response);
  });

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);

    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

router.post(
  '/:freetId/comments',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidComment,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOneComment(userId, req.body.content, req.params.freetId, req.body.commentPropagation === 'true');

    res.status(201).json({
      message: 'Your freet comment was created successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Modify a freet
 *
 * @name PUT /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.doesFreetExistGeneralDelete,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidToDelete,
    freetValidator.isEditedFreetContentValid
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content, req.body.toDelete, req.session.userId);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

export {router as freetRouter};
