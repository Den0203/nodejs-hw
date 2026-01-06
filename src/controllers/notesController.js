import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export async function getAllNotes(req, res, next) {
  try {
    const { page = 1, perPage = 10, tag, search = '' } = req.query;

    const limit = Number(perPage);
    const skip = (Number(page) - 1) * limit;

    const filters = {};

    if (tag) {
      filters.tag = tag;
    }

    if (typeof search === 'string' && search.length > 0) {
      filters.$text = { $search: search };
    }

    const baseQuery = Note.find().where(filters);

    const notesQuery = baseQuery.clone().skip(skip).limit(limit);

    if (filters.$text) {
      notesQuery.sort({ score: { $meta: 'textScore' } }).select({ score: { $meta: 'textScore' } });
    } else {
      notesQuery.sort({ createdAt: -1 });
    }

    const [totalNotes, notes] = await Promise.all([
      baseQuery.clone().countDocuments(),
      notesQuery.exec(),
    ]);

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
