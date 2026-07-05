import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireRole } from '@/lib/api-utils';
import { ObjectId } from 'mongodb';

export async function PUT(request, props) {
  const params = await props.params;
  try {
    const { user, error } = await requireRole(request, ['root']);
    if (error) return error;

    const data = await request.json();
    if (!data || !data.role) {
      return errorResponse('Role is required', 400);
    }

    if (!['root', 'admin', 'editor'].includes(data.role)) {
      return errorResponse('Invalid role', 400);
    }

    if (params.id === user.user_id && data.role !== user.role) {
      return errorResponse('Cannot change your own role', 400);
    }

    const db = await getDb();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { role: data.role, updated_at: new Date() } }
    );

    if (result.matchedCount === 0) {
      return errorResponse('User not found', 404);
    }

    return successResponse(null, 'User role updated');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function DELETE(request, props) {
  const params = await props.params;
  try {
    const { user, error } = await requireRole(request, ['root']);
    if (error) return error;

    if (params.id === user.user_id) {
      return errorResponse('Cannot delete yourself', 400);
    }

    const db = await getDb();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return errorResponse('User not found', 404);
    }

    return successResponse(null, 'User deleted');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
