import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireRole } from '@/lib/api-utils';
import { entityToDict } from '@/lib/models';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';

function generateUniqueSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 8);
}

export async function GET(request, props) {
  const params = await props.params;
  try {
    const db = await getDb();
    const identifier = params.id;
    let item = null;

    try {
      item = await db.collection('resources').findOne({ _id: new ObjectId(identifier) });
    } catch (e) {}

    if (!item && 'resources' !== 'team') {
      item = await db.collection('resources').findOne({ slug: identifier });
    }

    if (!item) {
      return errorResponse('Resource not found', 404);
    }

    return successResponse(entityToDict(item));
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function PUT(request, props) {
  const params = await props.params;
  try {
    const { user, error } = await requireRole(request, ['editor', 'admin', 'root']);
    if (error) return error;

    const data = await request.json();
    if (!data) return errorResponse('Request body is required', 400);

    const db = await getDb();
    const existing = await db.collection('resources').findOne({ _id: new ObjectId(params.id) });

    if (!existing) {
      return errorResponse('Resource not found', 404);
    }

    const update = { ...data };
    delete update._id;
    delete update.id;
    delete update.created_at;
    update.updated_at = new Date();

    if ('resources' !== 'team' && data.title && data.title !== existing.title) {
      update.slug = generateUniqueSlug(data.title);
    }

    await db.collection('resources').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: update }
    );

    const updated = await db.collection('resources').findOne({ _id: new ObjectId(params.id) });
    
    revalidateTag('resources');
    revalidateTag('homepage');
    revalidateTag('activity');

    return successResponse(entityToDict(updated), 'Resource updated');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function DELETE(request, props) {
  const params = await props.params;
  try {
    const { user, error } = await requireRole(request, ['admin', 'root']);
    if (error) return error;

    const db = await getDb();
    const result = await db.collection('resources').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return errorResponse('Resource not found', 404);
    }

    await db.collection('activity').deleteMany({ entity_type: 'resource', entity_id: params.id });
    
    revalidateTag('resources');
    revalidateTag('homepage');
    revalidateTag('activity');

    return successResponse(null, 'Resource deleted');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
