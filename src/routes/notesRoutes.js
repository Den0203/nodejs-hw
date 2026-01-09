import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllNotes);
router.get('/:noteId', getNoteById);
router.post('/', createNote);
router.patch('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

export default router;
