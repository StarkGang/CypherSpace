import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireRole } from '@/lib/api-utils';
import { projectToDict } from '@/lib/models';
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
    let project = null;

    try {
      project = await db.collection('projects').findOne({ _id: new ObjectId(identifier) });
    } catch (e) {
      
    }

    if (!project) {
      project = await db.collection('projects').findOne({ slug: identifier });
    }

    if (!project) {
      return errorResponse('Project not found', 404);
    }

    return successResponse(projectToDict(project));
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
    const existing = await db.collection('projects').findOne({ _id: new ObjectId(params.id) });

    if (!existing) {
      return errorResponse('Project not found', 404);
    }

    const update = { ...data };
    delete update._id;
    delete update.id;
    delete update.created_at;
    update.updated_at = new Date();

    if (data.title && data.title !== existing.title) {
      update.slug = generateUniqueSlug(data.title);
    }

    await db.collection('projects').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: update }
    );

    const project = await db.collection('projects').findOne({ _id: new ObjectId(params.id) });
    revalidateTag('projects');
    revalidateTag('homepage');
    return successResponse(projectToDict(project), 'Project updated');
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
    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return errorResponse('Project not found', 404);
    }

    await db.collection('activity').deleteMany({ entity_type: 'project', entity_id: params.id });
    revalidateTag('projects');
    revalidateTag('homepage');
    revalidateTag('activity');
    return successResponse(null, 'Project deleted');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
