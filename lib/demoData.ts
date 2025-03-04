import data from '~/data.json';
import { buildRoleData } from '~/helpers/buildRoleUserData';
import { User } from '~/types/user';
import { Task } from '~/types/task';

export const demoUsers = data.users as User[];
export const demoTasks = data.tasks as Task[];
export const demoUserRoleData = buildRoleData(demoUsers);
