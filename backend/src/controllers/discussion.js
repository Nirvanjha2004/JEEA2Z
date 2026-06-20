import { query } from '../db/index.js';

export const getComments = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const userId = req.user?.id; // Optional or auth-protected

    const result = await query(
      `SELECT dc.*, u.name as user_name, u.avatar_url as user_avatar_url,
              (SELECT COUNT(*)::int FROM comment_upvotes cu WHERE cu.comment_id = dc.id) as upvotes,
              CASE WHEN $2::uuid IS NULL THEN false
                   ELSE EXISTS(SELECT 1 FROM comment_upvotes cu WHERE cu.comment_id = dc.id AND cu.user_id = $2::uuid)
              END as user_upvoted
       FROM discussion_comments dc
       JOIN users u ON dc.user_id = u.id
       WHERE dc.question_id = $1
       ORDER BY dc.parent_id NULLS FIRST, upvotes DESC, dc.created_at ASC`,
      [questionId, userId || null]
    );

    const comments = result.rows;
    const topLevel = [];
    const repliesMap = {};

    comments.forEach((c) => {
      const commentObj = {
        id: c.id,
        questionId: c.question_id,
        parentId: c.parent_id,
        content: c.content,
        upvotes: c.upvotes,
        userUpvoted: c.user_upvoted,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        user: {
          id: c.user_id,
          name: c.user_name,
          avatarUrl: c.user_avatar_url,
        },
        replies: [],
      };

      if (c.parent_id === null) {
        topLevel.push(commentObj);
      } else {
        if (!repliesMap[c.parent_id]) {
          repliesMap[c.parent_id] = [];
        }
        repliesMap[c.parent_id].push(commentObj);
      }
    });

    // Nest replies
    topLevel.forEach((c) => {
      c.replies = repliesMap[c.id] || [];
      // Sort replies by creation date ascending
      c.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    // Sort top-level comments by upvotes desc, then created_at desc
    topLevel.sort((a, b) => b.upvotes - a.upvotes || new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ success: true, data: topLevel });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { questionId, content, parentId } = req.body;
    const userId = req.user.id;

    if (!questionId || !content) {
      return res.status(400).json({ success: false, message: 'questionId and content are required' });
    }

    const result = await query(
      `INSERT INTO discussion_comments (question_id, user_id, parent_id, content, upvotes)
       VALUES ($1, $2, $3, $4, 0)
       RETURNING *`,
      [questionId, userId, parentId || null, content]
    );

    // Fetch user details for the new comment response
    const userRes = await query('SELECT name, avatar_url FROM users WHERE id = $1', [userId]);

    return res.status(201).json({
      success: true,
      data: {
        ...result.rows[0],
        user: {
          id: userId,
          name: userRes.rows[0].name,
          avatarUrl: userRes.rows[0].avatar_url,
        },
        replies: [],
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ success: false, message: 'content is required' });
    }

    // Check ownership
    const commentRes = await query('SELECT user_id FROM discussion_comments WHERE id = $1', [commentId]);
    if (commentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (commentRes.rows[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied. You do not own this comment' });
    }

    const result = await query(
      'UPDATE discussion_comments SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [content, commentId]
    );

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Check ownership / admin status
    const commentRes = await query('SELECT user_id FROM discussion_comments WHERE id = $1', [commentId]);
    if (commentRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const userRes = await query('SELECT is_admin FROM users WHERE id = $1', [userId]);
    const isAdmin = userRes.rows[0]?.is_admin || false;

    if (commentRes.rows[0].user_id !== userId && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Access denied. Unauthorized to delete this comment' });
    }

    await query('DELETE FROM discussion_comments WHERE id = $1', [commentId]);

    return res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const upvoteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    // Check if upvoted
    const checkRes = await query(
      'SELECT * FROM comment_upvotes WHERE user_id = $1 AND comment_id = $2',
      [userId, commentId]
    );

    let userUpvoted = false;
    if (checkRes.rows.length > 0) {
      // Remove upvote
      await query(
        'DELETE FROM comment_upvotes WHERE user_id = $1 AND comment_id = $2',
        [userId, commentId]
      );
    } else {
      // Add upvote
      await query(
        'INSERT INTO comment_upvotes (user_id, comment_id) VALUES ($1, $2)',
        [userId, commentId]
      );
      userUpvoted = true;
    }

    // Get new count
    const countRes = await query(
      'SELECT COUNT(*)::int as count FROM comment_upvotes WHERE comment_id = $1',
      [commentId]
    );
    const count = countRes.rows[0].count;

    // Update upvotes column in discussion_comments for performance sorting
    await query('UPDATE discussion_comments SET upvotes = $1 WHERE id = $2', [count, commentId]);

    return res.json({
      success: true,
      data: {
        upvotes: count,
        userUpvoted,
      },
    });
  } catch (error) {
    next(error);
  }
};
