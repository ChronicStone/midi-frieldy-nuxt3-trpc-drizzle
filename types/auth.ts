import { z } from 'zod';
import { RouterOutput } from 'server/trpc/router';

export type AuthEmailCredentials = z.infer<typeof authEmailCredentialDto>;
export type AuthProviderCredentials = z.infer<typeof authProviderCredentialDto>;

export type AuthLoginDto = z.infer<typeof authLoginDto>;
export type AuthRegisterDto = z.infer<typeof authRegisterDto>;

export type AuthLoginData = RouterOutput['auth']['login'];
