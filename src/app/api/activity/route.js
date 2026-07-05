import { getDb } from '@/lib/db';
import { successResponse, errorResponse, paginatedResponse, requireRole } from '@/lib/api-utils';
import { entityToDict } from '@/lib/models';
import { revalidateTag } from 'next/cache';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '100');
    const entity_type = searchParams.get('entity_type');

    const query = {};
    if (entity_type) query.entity_type = entity_type;

    const db = await getDb();
    const total = await db.collection('activity').countDocuments(query);
    const cursor = db.collection('activity').find(query);
    
    cursor.sort({ created_at: -1 });
    
    const items = await cursor.skip((page - 1) * perPage).limit(perPage).toArray();

    return paginatedResponse(items.map(entityToDict), total, page, perPage);
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function POST(request) {
  try {
    const { user, error } = await requireRole(request, ['editor', 'admin', 'root']);
    if (error) return error;

    const data = await request.json();
    if (!data || !data.title) {
      return errorResponse('Validation failed: title is required', 400);
    }

    const db = await getDb();
    
    const doc = {
      ...data,
      created_at: new Date()
    };
    
    const result = await db.collection('activity').insertOne(doc);
    doc._id = result.insertedId;

    revalidateTag('activity');
    revalidateTag('homepage');
    
    return successResponse(entityToDict(doc), 'Activity created', 201);
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
