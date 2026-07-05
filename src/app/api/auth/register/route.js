import { getDb } from '@/lib/db';
import { successResponse, errorResponse, requireRole } from '@/lib/api-utils';
import { userToDict } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { user, error } = await requireRole(request, ['root']);
    if (error) return error;

    const data = await request.json();
    if (!data.name || !data.email || !data.password) {
      return errorResponse('Validation failed', 400);
    }

    if (data.password.length < 8) {
      return errorResponse('Password must be at least 8 characters', 400);
    }

    const role = data.role || 'editor';
    if (!['root', 'admin', 'editor'].includes(role)) {
      return errorResponse('Role must be root, admin or editor', 400);
    }

    const db = await getDb();
    const existing = await db.collection('users').findOne({ email: data.email.toLowerCase().trim() });
    if (existing) {
      return errorResponse('Email already registered', 409);
    }

    const password_hash = await bcrypt.hash(data.password, 10);
    const doc = {
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password_hash,
      role,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await db.collection('users').insertOne(doc);
    doc._id = result.insertedId;

    return successResponse(userToDict(doc), 'User created successfully', 201);
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
