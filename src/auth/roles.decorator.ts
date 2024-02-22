import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const HasRole = (role: string) => SetMetadata(ROLE_KEY, role);
