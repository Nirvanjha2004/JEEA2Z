import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  // Log errors in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', err);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const message = err.issues[0]?.message || 'Validation error';
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Handle known error types
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
