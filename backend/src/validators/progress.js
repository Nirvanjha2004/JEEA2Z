import { z } from 'zod';

export const updateProgressSchema = z.object({
  questionId: z.number().int().positive('Question ID must be a positive integer'),
  status: z.enum(['todo', 'done', 'revisit'], {
    errorMap: () => ({ message: "Status must be 'todo', 'done', or 'revisit'" }),
  }),
});
