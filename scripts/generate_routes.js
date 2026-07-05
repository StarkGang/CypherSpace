const fs = require('fs');
const path = require('path');

const entities = ['events', 'papers', 'resources', 'blogs', 'achievements', 'team'];

const routeTemplate = (entity, collection) => `import { getDb } from '@/lib/db';
import { successResponse, errorResponse, paginatedResponse, requireRole } from '@/lib/api-utils';
import { entityToDict } from '@/lib/models';

function generateUniqueSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 8);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '12');
    const status = searchParams.get('status');
    const tag = searchParams.get('tag');

    const query = {};
    if (status) query.status = status;
    if (tag) query.tags = tag;

    const db = await getDb();
    const total = await db.collection('${collection}').countDocuments(query);
    const cursor = db.collection('${collection}').find(query);
    
    if ('${collection}' === 'team') {
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
    
    if ('${collection}' !== 'team') {
      doc.slug = slug;
    }

    const result = await db.collection('${collection}').insertOne(doc);
    doc._id = result.insertedId;

    await db.collection('activity').insertOne({
      type: 'created',
      title: titleOrName,
      entity_type: '${collection.replace(/s$/, '')}',
      entity_id: result.insertedId.toString(),
      entity_slug: slug,
      created_at: new Date()
    });

    return successResponse(entityToDict(doc), '${entity} created', 201);
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
`;

const idRouteTemplate = (entity, collection) => `import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireRole } from '@/lib/api-utils';
import { entityToDict } from '@/lib/models';
import { ObjectId } from 'mongodb';

function generateUniqueSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 8);
}

export async function GET(request, { params }) {
  try {
    const db = await getDb();
    const identifier = params.id;
    let item = null;

    try {
      item = await db.collection('${collection}').findOne({ _id: new ObjectId(identifier) });
    } catch (e) {}

    if (!item && '${collection}' !== 'team') {
      item = await db.collection('${collection}').findOne({ slug: identifier });
    }

    if (!item) {
      return errorResponse('${entity} not found', 404);
    }

    return successResponse(entityToDict(item));
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const { user, error } = await requireRole(request, ['editor', 'admin', 'root']);
    if (error) return error;

    const data = await request.json();
    if (!data) return errorResponse('Request body is required', 400);

    const db = await getDb();
    const existing = await db.collection('${collection}').findOne({ _id: new ObjectId(params.id) });

    if (!existing) {
      return errorResponse('${entity} not found', 404);
    }

    const update = { ...data };
    delete update._id;
    delete update.id;
    delete update.created_at;
    update.updated_at = new Date();

    if ('${collection}' !== 'team' && data.title && data.title !== existing.title) {
      update.slug = generateUniqueSlug(data.title);
    }

    await db.collection('${collection}').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: update }
    );

    const updated = await db.collection('${collection}').findOne({ _id: new ObjectId(params.id) });
    return successResponse(entityToDict(updated), '${entity} updated');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { user, error } = await requireRole(request, ['admin', 'root']);
    if (error) return error;

    const db = await getDb();
    const result = await db.collection('${collection}').deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return errorResponse('${entity} not found', 404);
    }

    await db.collection('activity').deleteMany({ entity_type: '${collection.replace(/s$/, '')}', entity_id: params.id });
    return successResponse(null, '${entity} deleted');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
`;

const rootDir = path.join(__dirname, '../src/app/api');

entities.forEach(entity => {
  const entityName = entity.charAt(0).toUpperCase() + entity.slice(1, -1);
  const dir = path.join(rootDir, entity);
  const idDir = path.join(dir, '[id]');
  
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(idDir)) fs.mkdirSync(idDir, { recursive: true });
  
  fs.writeFileSync(path.join(dir, 'route.js'), routeTemplate(entityName, entity));
  fs.writeFileSync(path.join(idDir, 'route.js'), idRouteTemplate(entityName, entity));
});

console.log('Routes generated successfully.');
