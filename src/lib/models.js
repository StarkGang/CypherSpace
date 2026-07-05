export function userToDict(user) {
  if (!user) return null;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at.toISOString(),
    updated_at: user.updated_at.toISOString(),
  };
}

export function entityToDict(entity) {
  if (!entity) return null;
  const { _id, ...rest } = entity;
  return {
    id: _id?.toString(),
    ...rest,
    created_at: entity.created_at?.toISOString() || null,
    updated_at: entity.updated_at?.toISOString() || null,
  };
}

export const projectToDict = entityToDict;
export const eventToDict = entityToDict;
export const paperToDict = entityToDict;
export const resourceToDict = entityToDict;
export const blogToDict = entityToDict;
export const achievementToDict = entityToDict;
export const teamMemberToDict = entityToDict;
export const activityToDict = entityToDict;
