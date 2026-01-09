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

router.get('/notes', authenticate, getAllNotes);
router.get('/notes/:noteId', authenticate, getNoteById);
router.post('/notes', authenticate, createNote);
router.patch('/notes/:noteId', authenticate, updateNote);
router.delete('/notes/:noteId', authenticate, deleteNote);

export default router;
