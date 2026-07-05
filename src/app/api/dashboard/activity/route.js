import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-utils';

export async function GET(request) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const db = await getDb();
    const activities = await db.collection('activity')
      .find({})
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    const formatted = activities.map(act => {
      const { _id, ...rest } = act;
      return {
        id: _id.toString(),
        ...rest,
        created_at: act.created_at?.toISOString() || null
      };
    });

    return successResponse(formatted);
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
