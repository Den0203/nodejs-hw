import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import fs from 'node:fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { sendEmail } from '../utils/sendEmail.js';

export const requestResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: 'Password reset email sent successfully',
      });
    }

    const token = jwt.sign({ sub: user._id, email }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const templatePath = path.resolve('src/templates/reset-password-email.html');
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateSource);

    const html = template({
      name: user.username,
      link: `${process.env.FRONTEND_DOMAIN}/reset-password?token=${token}`,
    });

    await sendEmail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html,
    });

    res.status(200).json({
      message: 'Password reset email sent successfully',
    });
  } catch {
    next(createHttpError(500, 'Failed to send the email, please try again later.'));
  }
};
