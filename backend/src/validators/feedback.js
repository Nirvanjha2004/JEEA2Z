import { z } from 'zod';

export const feedbackSchema = z.object({
  category: z.enum(['bug', 'feature', 'questions', 'general'], {
    errorMap: () => ({ message: 'Category must be one of: bug, feature, questions, or general' })
  }),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must not exceed 1000 characters'),
  rating: z.number().int().min(1).max(5).optional().nullable()
});
