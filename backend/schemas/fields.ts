import { checkbox } from '@keystone-next/fields';

export const permissionFields = {
    canManageProducts: checkbox({
        defaultValue: false,
        label: 'User can Update and Delete any product',
    }),

    canManageProducts: checkbox({
        defaultValue: false,
        label: 'User can Update and Delete any product',
    }),

    canSeeOtherUsers: checkbox({
        defaultValue: false,
        label: 'User can query other users',
    }),

    canManageUsers: checkbox({
        defaultValue: false,
        label: 'User can modify other users',
    }),

    canManageRoles: checkbox({
        defaultValue: false,
        label: 'User can Manage (CRUD) roles',
    }),

    canManageCart: checkbox({
        defaultValue: false,
        label: 'User can see and manage Cart and Cart items',
    }),

    canManageOrders: checkbox({
        defaultValue: false,
        label: 'User can see and manage Orders',
    }),
};

export type Permission = keyof typeof permissionFields;

export const permissionsList: Permission[] = Object.keys(
    permissionFields
) as Permission[];
