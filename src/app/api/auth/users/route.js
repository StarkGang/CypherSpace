import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireRole } from '@/lib/api-utils';
import { userToDict } from '@/lib/models';

export async function GET(request) {
  try {
    const { user, error } = await requireRole(request, ['root']);
    if (error) return error;

    const db = await getDb();
    const users = await db.collection('users').find({}).sort({ created_at: -1 }).toArray();

    return successResponse(users.map(userToDict));
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
