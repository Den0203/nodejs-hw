import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export async function getAllNotes(req, res, next) {
  try {
    const { page = 1, perPage = 10, tag, search = '' } = req.query;

    const limit = Number(perPage);
    const skip = (Number(page) - 1) * limit;

    const baseQuery = Note.find().where('userId').equals(req.user._id);

    if (tag) {
      baseQuery.where('tag').equals(tag);
    }

    const hasSearch = typeof search === 'string' && search.length > 0;
    if (hasSearch) {
      baseQuery.where({ $text: { $search: search } });
    }

    const countQuery = baseQuery.clone().countDocuments();

    const notesQuery = baseQuery
      .clone()
      .skip(skip)
      .limit(limit)
      .sort(hasSearch ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    if (hasSearch) {
      notesQuery.select({ score: { $meta: 'textScore' } });
    }

    const [totalNotes, notes] = await Promise.all([countQuery, notesQuery.exec()]);

    const totalPages = Math.ceil(totalNotes / limit) || 1;

    res.status(200).json({
      page: Number(page),
      perPage: limit,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (err) {
    next(err);
  }
}

export async function getNoteById(req, res, next) {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
}

export async function createNote(req, res, next) {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
}

export async function updateNote(req, res, next) {
  try {
    const { noteId } = req.params;

    const updated = await Note.findOneAndUpdate({ _id: noteId, userId: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const { noteId } = req.params;

    const deleted = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });

    if (!deleted) {
      throw createHttpError(404, 'Note not found');
    }

    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
}
