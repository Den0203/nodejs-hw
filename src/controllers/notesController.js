import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export async function getAllNotes(req, res, next) {
  try {
    const { page = 1, perPage = 10, tag, search = '' } = req.query;

    const limit = Number(perPage);
    const skip = (Number(page) - 1) * limit;

    const filter = {};

    if (tag) filter.tag = tag;

    if (typeof search === 'string' && search.length > 0) {
      filter.$text = { $search: search };
    }

    const totalNotes = await Note.countDocuments(filter);

    const sort = filter.$text ? { score: { $meta: 'textScore' } } : { createdAt: -1 };

    const notesQuery = Note.find(filter).sort(sort).skip(skip).limit(limit);

    if (filter.$text) {
      notesQuery.select({ score: { $meta: 'textScore' } });
    }

    const notes = await notesQuery;

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

    const note = await Note.findById(noteId);
    if (!note) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
}

export async function createNote(req, res, next) {
  try {
    const created = await Note.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function updateNote(req, res, next) {
  try {
    const { noteId } = req.params;

    const updated = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const { noteId } = req.params;

    const deleted = await Note.findByIdAndDelete(noteId);
    if (!deleted) {
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
}
