import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-utils';
import { userToDict } from '@/lib/models';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const db = await getDb();
    const dbUser = await db.collection('users').findOne({ _id: new ObjectId(user.user_id) });

    if (!dbUser) {
      return errorResponse('User not found', 404);
    }

    return successResponse(userToDict(dbUser));
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function PUT(request) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const data = await request.json();
    if (!data) return errorResponse('Request body is required', 400);

    const db = await getDb();
    const update = { updated_at: new Date() };

    if (data.name) {
      update.name = data.name;
    }

    if (data.password) {
      if (!data.current_password) {
        return errorResponse('Current password is required to change password', 400);
      }
      if (data.password.length < 8) {
        return errorResponse('Password must be at least 8 characters', 400);
      }

      const dbUser = await db.collection('users').findOne({ _id: new ObjectId(user.user_id) });
      if (!dbUser) return errorResponse('User not found', 404);

      let passwordHash = dbUser.password_hash;
      if (passwordHash && typeof passwordHash === 'object') {
        passwordHash = passwordHash.buffer ? Buffer.from(passwordHash.buffer).toString('utf8') : passwordHash.toString('utf8');
      }

      if (!passwordHash) {
        return errorResponse('Invalid user state', 500);
      }

      const isMatch = await bcrypt.compare(data.current_password, passwordHash);
      if (!isMatch) {
        return errorResponse('Incorrect current password', 401);
      }

      update.password_hash = await bcrypt.hash(data.password, 10);
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(user.user_id) },
      { $set: update }
    );

    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(user.user_id) });
    return successResponse(userToDict(updatedUser), 'Profile updated');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
