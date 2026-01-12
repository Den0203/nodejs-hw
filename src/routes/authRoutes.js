import { Router } from 'express';
import { celebrate } from 'celebrate';

import { resetPassword } from '../controllers/authController.js';
import { resetPasswordSchema } from '../validations/authValidation.js';

import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
} from '../controllers/authController.js';

import { registerUserSchema, loginUserSchema } from '../validations/authValidation.js';

import { requestResetEmail } from '../controllers/authController.js';
import { requestResetEmailSchema } from '../validations/authValidation.js';

const router = Router();

router.post('/register', celebrate({ body: registerUserSchema }), registerUser);
router.post('/login', celebrate({ body: loginUserSchema }), loginUser);

router.post('/request-reset-email', celebrate(requestResetEmailSchema), requestResetEmail);

router.post('/refresh', refreshUserSession);
router.post('/logout', logoutUser);
router.post('/reset-password', celebrate(resetPasswordSchema), resetPassword);

export default router;
