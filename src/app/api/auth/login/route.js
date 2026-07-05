import { getDb } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { userToDict } from '@/lib/models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.email || !data.password) {
      return errorResponse('Validation failed', 400, {
        email: !data.email ? 'Required' : null,
        password: !data.password ? 'Required' : null,
      });
    }

    const db = await getDb();
    const user = await db.collection('users').findOne({ email: data.email.toLowerCase().trim() });

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    let passwordHash = user.password_hash;
    if (passwordHash && typeof passwordHash === 'object') {
      passwordHash = passwordHash.buffer ? Buffer.from(passwordHash.buffer).toString('utf8') : passwordHash.toString('utf8');
    }

    if (!passwordHash) {
      return errorResponse('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(data.password, passwordHash);
    if (!isMatch) {
      return errorResponse('Invalid email or password', 401);
    }

    const payload = {
      user_id: user._id.toString(),
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return successResponse({
      token,
      user: userToDict(user),
    }, 'Login successful');

  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
