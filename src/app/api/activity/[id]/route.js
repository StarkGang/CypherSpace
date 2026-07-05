import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireRole } from '@/lib/api-utils';
import { entityToDict } from '@/lib/models';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';

export async function GET(request, props) {
  const params = await props.params;
  try {
    const db = await getDb();
    const identifier = params.id;
    let item = null;

    try {
      item = await db.collection('activity').findOne({ _id: new ObjectId(identifier) });
    } catch (e) {}

    if (!item) {
      return errorResponse('Activity not found', 404);
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
    const existing = await db.collection('activity').findOne({ _id: new ObjectId(params.id) });

    if (!existing) {
      return errorResponse('Activity not found', 404);
    }

    const update = { ...data };
    delete update._id;
    delete update.id;
    delete update.created_at;

    await db.collection('activity').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: update }
    );

    const updated = await db.collection('activity').findOne({ _id: new ObjectId(params.id) });
    
    revalidateTag('activity');
    revalidateTag('homepage');

    return successResponse(entityToDict(updated), 'Activity updated');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function DELETE(request, props) {
  const params = await props.params;
  try {
    const { user, error } = await requireRole(request, ['admin', 'root', 'editor']);
    if (error) return error;

    const db = await getDb();
    const result = await db.collection('activity').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return errorResponse('Activity not found', 404);
    }

    revalidateTag('activity');
    revalidateTag('homepage');

    return successResponse(null, 'Activity deleted');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
