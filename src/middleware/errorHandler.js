import { isHttpError } from 'http-errors';

export function errorHandler(err, req, res, _next) {
  req.log?.error({ err }, 'Unhandled error');

  if (isHttpError(err)) {
    return res.status(err.status).json({ message: err.message });
  }

  res.status(500).json({ message: 'Internal Server Error' });
}
