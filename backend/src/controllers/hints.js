import { groq } from '../lib/groq.js';
import { query } from '../db/index.js';

export const getHint = async (req, res, next) => {
  const userId = req.user.id;
  const questionId = parseInt(req.params.questionId, 10);

  if (isNaN(questionId)) {
    return res.status(400).json({ success: false, message: 'Invalid question ID.' });
  }

  try {
    // 1. Check user info (is_admin / is_pro)
    const userRes = await query('SELECT is_admin FROM users WHERE id = $1', [userId]);
    const isPro = userRes.rows[0]?.is_admin || false; // Currently admins are pro.

    // 2. Check hint_cache (if exists and generated_at is less than 7 days ago)
    const cacheRes = await query(
      `SELECT hint_text FROM hint_cache 
       WHERE question_id = $1 AND generated_at > NOW() - INTERVAL '7 days'`,
      [questionId]
    );

    if (cacheRes.rows.length > 0) {
      const cachedHint = cacheRes.rows[0].hint_text;

      // Stream cached hint to client
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // We can stream it in a single chunk or small sub-chunks
      res.write(`data: ${JSON.stringify({ text: cachedHint })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }

    // 3. Check hint_usage for today
    const usageRes = await query(
      'SELECT count FROM hint_usage WHERE user_id = $1 AND date = CURRENT_DATE',
      [userId]
    );

    const todayCount = usageRes.rows[0]?.count || 0;

    if (!isPro && todayCount >= 5) {
      return res.status(403).json({
        message: 'Daily hint limit reached',
        upgradeRequired: true
      });
    }

    // 4. Fetch question details from DB
    const questionRes = await query(
      `SELECT q.title, q.notes, q.source, q.type,
              c.name as chapter, s.name as subject
       FROM questions q
       JOIN chapters c ON q.chapter_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE q.id = $1`,
      [questionId]
    );

    if (questionRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const question = questionRes.rows[0];

    // 5. Call Groq with streaming
    const systemPrompt = `You are a JEE expert tutor. Give a concise 3-step hint for the student.
Rules:
- DO NOT give the final answer
- DO NOT solve the full problem
- Give 3 progressive nudges only
- Each nudge is 1-2 sentences max
- Use simple language
- Mention the key concept or formula the student should recall
- Format as:
💡 Hint 1: ...
💡 Hint 2: ...
💡 Hint 3: ...`;

    const userPrompt = `Subject: ${question.subject}
Chapter: ${question.chapter}
Question: ${question.title}
Source: ${question.source || 'N/A'}
${question.notes ? `Context: ${question.notes}` : ''}`;

    const stream = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: true,
      max_tokens: 300,
      temperature: 0.3
    });

    // 6. Set headers for SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullText = '';

    // 7. Stream each chunk to client
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        fullText += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

    // 8. After stream ends, perform caching and usage updates
    if (fullText.trim().length > 0) {
      // Upsert cache
      await query(
        `INSERT INTO hint_cache (question_id, hint_text, generated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (question_id)
         DO UPDATE SET hint_text = EXCLUDED.hint_text, generated_at = NOW()`,
        [questionId, fullText]
      );

      // Upsert usage count
      await query(
        `INSERT INTO hint_usage (user_id, date, count)
         VALUES ($1, CURRENT_DATE, 1)
         ON CONFLICT (user_id, date)
         DO UPDATE SET count = hint_usage.count + 1`,
        [userId]
      );
    }

  } catch (error) {
    console.error('Error generating hint:', error);
    // If headers are already sent, we must close the connection, otherwise call next
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'Error generating hint' })}\n\n`);
      res.write('data: [DONE]\n\n');
      return res.end();
    }
    next(error);
  }
};

// Admin only/Dev only endpoint to clear hint cache
export const deleteHintCache = async (req, res, next) => {
  const questionId = parseInt(req.params.questionId, 10);
  if (isNaN(questionId)) {
    return res.status(400).json({ success: false, message: 'Invalid question ID.' });
  }

  try {
    await query('DELETE FROM hint_cache WHERE question_id = $1', [questionId]);
    res.json({ success: true, message: 'Hint cache cleared successfully.' });
  } catch (error) {
    next(error);
  }
};
