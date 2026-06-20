import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/index.js';
import { registerSchema, loginSchema } from '../validators/auth.js';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Google ID Token is required' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid Google ID Token' });
    }

    const { sub: googleId, name, email, picture: avatarUrl } = payload;

    // Check if user already exists with this googleId
    let result = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    let user;

    if (result.rows.length > 0) {
      user = result.rows[0];
    } else {
      // Check if user already exists with this email
      const existingEmail = await query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingEmail.rows.length > 0) {
        // Link google account to existing email
        const updateRes = await query(
          'UPDATE users SET google_id = $1, avatar_url = $2 WHERE email = $3 RETURNING *',
          [googleId, avatarUrl, email]
        );
        user = updateRes.rows[0];
      } else {
        // Create new user with standard credentials
        const randomPassword = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        const insertRes = await query(
          'INSERT INTO users (name, email, password, google_id, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [name, email, hashedPassword, googleId, avatarUrl]
        );
        user = insertRes.rows[0];
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url,
          is_admin: user.is_admin,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const validated = registerSchema.parse(req.body);

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [validated.email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Insert user
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [validated.name, validated.email, hashedPassword]
    );

    const user = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validated = loginSchema.parse(req.body);

    // Find user by email
    const result = await query('SELECT * FROM users WHERE email = $1', [validated.email]);
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Compare password
    const isValid = await bcrypt.compare(validated.password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, avatar_url, is_admin, is_public, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
