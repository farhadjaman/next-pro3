import data from '~/data.json';
import { buildRoleData } from '~/helpers/buildRoleUserData';
import { User } from '~/types/user';

export const demoUsers = data.users as User[];
export const demoTasks = data.tasks;
export const demoUserRoleData = buildRoleData(demoUsers);
