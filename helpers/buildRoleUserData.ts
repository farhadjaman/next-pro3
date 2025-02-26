import { UserRole, User } from '~/types/user';

export function buildRoleData(users: User[]): Array<string | UserRole> {
  const roleMap = new Map<string, Array<UserRole>>();

  for (const user of users) {
    for (const role of user.userRole) {
      if (!roleMap.has(role)) {
        roleMap.set(role, []);
      }
      roleMap.get(role)!.push({ id: user.id, role, title: user.firstName + ' ' + user.lastName });
    }
  }

  // 2) Sort roles for a consistent order (optional)
  const sortedRoles = Array.from(roleMap.keys()).sort();

  // 3) Build the final array of headers + user objects
  const result: Array<string | UserRole> = [];
  for (const role of sortedRoles) {
    // Add the role as a string (for the "header")
    result.push(role);

    // Add each user in that role as { id, name }
    const userItems = roleMap.get(role)!;
    for (const userObj of userItems) {
      result.push(userObj);
    }
  }
  return result;
}
