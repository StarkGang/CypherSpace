import { revalidatePath } from 'next/cache';
import { successResponse, errorResponse, requireRole } from '@/lib/api-utils';

export async function POST(request) {
  try {
    const { user, error } = await requireRole(request, ['editor', 'admin', 'root']);
    if (error) return error;

    
    revalidatePath('/', 'layout');

    return successResponse(null, 'Cache cleared successfully');
  } catch (error) {
    console.error(error);
    return errorResponse('Internal Server Error', 500);
  }
}
