import { getDb } from '@/lib/db';
import { successResponse, errorResponse, paginatedResponse, requireRole } from '@/lib/api-utils';
import { projectToDict } from '@/lib/models';
import { revalidateTag } from 'next/cache';

function generateUniqueSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 8);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '100');
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');

    const query = {};
    if (status) query.status = status;
    if (tag) query.tags = tag;
    if (featured === 'true') query.featured = true;

    const db = await getDb();
    const total = await db.collection('projects').countDocuments(query);
    const projects = await db.collection('projects')
      .find(query)
      .sort({ created_at: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    return paginatedResponse(projects.map(projectToDict), total, page, perPage);
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
      return errorResponse('Validation failed', 400, { title: 'Required' });
    }

    const slug = generateUniqueSlug(data.title);
    const db = await getDb();
    
    const doc = {
      ...data,
      slug,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('projects').insertOne(doc);
    doc._id = result.insertedId;

    await db.collection('activity').insertOne({
      type: 'created',
      title: data.title,
      entity_type: 'project',
      entity_id: result.insertedId.toString(),
      entity_slug: slug,
      external_url: data.external_url || null,
      created_at: new Date()
    });

    revalidateTag('projects');
    revalidateTag('homepage');
    revalidateTag('activity');
    return successResponse(projectToDict(doc), 'Project created', 201);
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
