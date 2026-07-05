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
      item = await db.collection('blogs').findOne({ _id: new ObjectId(identifier) });
    } catch (e) {}

    if (!item && 'blogs' !== 'team') {
      item = await db.collection('blogs').findOne({ slug: identifier });
    }

    if (!item) {
      return errorResponse('Blog not found', 404);
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
    const existing = await db.collection('blogs').findOne({ _id: new ObjectId(params.id) });

    if (!existing) {
      return errorResponse('Blog not found', 404);
    }

    const update = { ...data };
    delete update._id;
    delete update.id;
    delete update.created_at;
    update.updated_at = new Date();

    if ('blogs' !== 'team' && data.title && data.title !== existing.title) {
      update.slug = generateUniqueSlug(data.title);
    }

    await db.collection('blogs').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: update }
    );

    const updated = await db.collection('blogs').findOne({ _id: new ObjectId(params.id) });
    revalidateTag('blogs');
    revalidateTag('homepage');
    return successResponse(entityToDict(updated), 'Blog updated');
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
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return errorResponse('Blog not found', 404);
    }

    await db.collection('activity').deleteMany({ entity_type: 'blog', entity_id: params.id });
    revalidateTag('blogs');
    revalidateTag('homepage');
    revalidateTag('activity');
    return successResponse(null, 'Blog deleted');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
