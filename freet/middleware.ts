import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import moment from 'moment';

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId is req.params exists
 */
const doesFreetExistGeneral = async (req: Request, res: Response, next: NextFunction) => {
  const freetId = (req.query.freetId ?? req.body.freetId) as string;
  if (!freetId) {
    res.status(400).json({
      error: {
        freetNotSpecified: 'FreetId must not be empty'
      }
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(freetId);
  const freet = validFormat ? await FreetCollection.findOne(freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

const doesFreetExistGeneralDelete = async (req: Request, res: Response, next: NextFunction) => {
  const {freetId} = req.params;
  if (!freetId) {
    res.status(400).json({
      error: {
        freetNotSpecified: 'FreetId must not be empty'
      }
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(freetId);
  const freet = validFormat ? await FreetCollection.findOneExisted(freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOneExisted(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

const isValidDate = async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.deadlineYear === '' || req.query.deadlineMonth === '' || req.query.deadlineDay === '') {
    res.status(400).json({
      error: 'Missing a date parameter.'
    });
    return;
  }

  const day = (req.query.deadlineDay as string).length === 1 ? '0' + (req.query.deadlineDay as string) : req.query.deadlineDay as string;
  const month = (req.query.deadlineMonth as string).length === 1 ? '0' + (req.query.deadlineMonth as string) : req.query.deadlineMonth as string;
  const year = req.query.deadlineYear as string;
  const dateString = month + '/' + day + '/' + year;
  const isValid = moment(dateString, 'MM/DD/YYYY', true).isValid();
  if (!isValid) {
    res.status(400).json({
      error: 'Invalid date.'
    });
    return;
  }

  next();
};

const isValidComment = async (req: Request, res: Response, next: NextFunction) => {
  const commentPropagation = req.body.commentPropagation as string;
  if (commentPropagation !== 'true' && commentPropagation !== 'false') {
    res.status(400).json({
      error: 'Invalid comment propagation. Must be true or false'
    });
    return;
  }

  next();
};

const isValidToDelete = async (req: Request, res: Response, next: NextFunction) => {
  const toDelete = req.body.toDelete as string;
  if (toDelete && toDelete !== 'true' && toDelete !== 'false') {
    res.status(400).json({
      error: 'Invalid to delete: must be true or false.'
    });
  }

  next();
};

const isEditedFreetContentValid = async (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

export {
  isValidFreetContent,
  isFreetExists,
  isValidFreetModifier,
  doesFreetExistGeneral,
  isValidDate,
  isValidComment,
  isValidToDelete,
  isEditedFreetContentValid,
  doesFreetExistGeneralDelete
};
