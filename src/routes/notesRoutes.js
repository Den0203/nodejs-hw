import { Router } from 'express';
import { celebrate } from 'celebrate';

import { authenticate } from '../middleware/authenticate.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

router.get('/', authenticate, celebrate(getAllNotesSchema), getAllNotes);

router.get('/:noteId', authenticate, celebrate(noteIdSchema), getNoteById);

router.post('/', authenticate, celebrate(createNoteSchema), createNote);

router.patch('/:noteId', authenticate, celebrate(updateNoteSchema), updateNote);

router.delete('/:noteId', authenticate, celebrate(noteIdSchema), deleteNote);

export default router;
