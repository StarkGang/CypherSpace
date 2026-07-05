import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDb } from './db';
import { ObjectId } from 'mongodb';

export function successResponse(data = null, message = 'Success', status = 200) {
  return NextResponse.json({
    status: 'success',
    message,
    data
  }, { status });
}

export function errorResponse(message = 'Error', status = 400, errors = null) {
  return NextResponse.json({
    status: 'error',
    message,
    errors
  }, { status });
}

export function paginatedResponse(data, total, page, perPage) {
  return NextResponse.json({
    status: 'success',
    data,
    meta: {
      total,
      page,
      per_page: perPage,
      total_pages: Math.ceil(total / perPage)
    }
  });
}

export async function requireAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: errorResponse('Missing or invalid token', 401) };
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { user: decoded, error: null };
  } catch (err) {
    return { user: null, error: errorResponse('Invalid or expired token', 401) };
  }
}

export async function requireRole(request, allowedRoles) {
  const { user, error } = await requireAuth(request);
  if (error) return { user: null, error };

  if (!allowedRoles.includes(user.role)) {
    return { user: null, error: errorResponse('Insufficient permissions', 403) };
  }

  return { user, error: null };
}


export function isValidObjectId(id) {
  return ObjectId.isValid(id);
}
