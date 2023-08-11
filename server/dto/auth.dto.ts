import { z } from 'zod';

export const authEmailCredentialDto = z.object({
  type: z.literal('email'),
  email: z.string().email(),
  password: z.string().min(8),
});

export const authProviderCredentialDto = z.object({
  type: z.enum(['google', 'facebook', 'linkedin']),
  email: z.string().email(),
  userId: z.string(),
});

export const authLoginDto = z.union([authEmailCredentialDto, authProviderCredentialDto]);

export const authRegisterDto = z.intersection(
  z.union([
    z.object({
      type: z.literal('email'),
      password: z.string().min(8),
    }),
    z.object({
      type: z.enum(['google', 'facebook', 'linkedin']),
      userId: z.string(),
    }),
  ]),
  z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    avatar: z.string().url().optional(),
  }),
);

export const authLinkDto = authLoginDto;
