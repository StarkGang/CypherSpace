import { getDb } from '@/lib/db';
import { successResponse, errorResponse, paginatedResponse, requireRole } from '@/lib/api-utils';
import { entityToDict } from '@/lib/models';
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

    const query = {};
    if (status) query.status = status;
    if (tag) query.tags = tag;

    const db = await getDb();
    const total = await db.collection('papers').countDocuments(query);
    const cursor = db.collection('papers').find(query);
    
    if ('papers' === 'team') {
      cursor.sort({ display_order: 1 });
    } else {
      cursor.sort({ created_at: -1 });
    }
    
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
    if (!data || (!data.title && !data.name)) {
      return errorResponse('Validation failed', 400);
    }

    const titleOrName = data.title || data.name;
    const slug = generateUniqueSlug(titleOrName);
    const db = await getDb();
    
    const doc = {
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    if ('papers' !== 'team') {
      doc.slug = slug;
    }

    const result = await db.collection('papers').insertOne(doc);
    doc._id = result.insertedId;

    await db.collection('activity').insertOne({
      type: 'created',
      title: titleOrName,
      entity_type: 'paper',
      entity_id: result.insertedId.toString(),
      entity_slug: slug,
      external_url: data.external_url || null,
      created_at: new Date()
    });

    revalidateTag('papers');
    revalidateTag('homepage');
    revalidateTag('activity');
    return successResponse(entityToDict(doc), 'Paper created', 201);
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
