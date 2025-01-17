import { consola } from 'consola';
import * as jwt from 'jsonwebtoken';
import { z, ZodError, ZodSchema } from 'zod';

export function jwtSafeParse<T extends ZodSchema>(token: string, schema: T): z.infer<T> | null {
  const decoded = jwt.decode(token);
  if (!decoded) return null;
  try {
    return schema.parse(decoded);
  } catch (e: any) {
    consola.error('ERROR PARSING JWT', e);
    return null;
  }
}
