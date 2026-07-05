import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireAuth } from '@/lib/api-utils';

export async function GET(request) {
  try {
    const { user, error } = await requireAuth(request);
    if (error) return error;

    const db = await getDb();
    
    const [projects, events, papers, resources, blogs, achievements, team, users] = await Promise.all([
      db.collection('projects').countDocuments(),
      db.collection('events').countDocuments(),
      db.collection('papers').countDocuments(),
      db.collection('resources').countDocuments(),
      db.collection('blogs').countDocuments(),
      db.collection('achievements').countDocuments(),
      db.collection('team').countDocuments(),
      db.collection('users').countDocuments(),
    ]);

    return successResponse({
      projects, events, papers, resources, blogs, achievements, team, users
    });
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
