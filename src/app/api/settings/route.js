import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireRole } from '@/lib/api-utils';
import { revalidateTag } from 'next/cache';

export async function GET(request) {
  try {
    const db = await getDb();
    let settings = await db.collection('settings').findOne({});
    
    if (!settings) {
      const defaultSettings = {
        club_name: 'Cypher Space',
        club_subtitle: 'Blockchain & Web3 Community, NSSCE',
        created_at: new Date(),
        updated_at: new Date()
      };
      const result = await db.collection('settings').insertOne(defaultSettings);
      settings = { _id: result.insertedId, ...defaultSettings };
    }

    const { _id, ...rest } = settings;
    return successResponse({ id: _id.toString(), ...rest });
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}

export async function PUT(request) {
  try {
    const { user, error } = await requireRole(request, ['admin', 'root']);
    if (error) return error;

    const data = await request.json();
    if (!data) return errorResponse('Request body is required', 400);

    const db = await getDb();
    let settings = await db.collection('settings').findOne({});
    
    if (!settings) {
      return errorResponse('Settings not initialized', 400);
    }

    const update = { ...data };
    delete update._id;
    delete update.id;
    delete update.created_at;
    update.updated_at = new Date();

    await db.collection('settings').updateOne(
      { _id: settings._id },
      { $set: update }
    );

    const updated = await db.collection('settings').findOne({ _id: settings._id });
    const { _id, ...rest } = updated;
    revalidateTag('settings');
    revalidateTag('homepage');
    return successResponse({ id: _id.toString(), ...rest }, 'Settings updated');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
