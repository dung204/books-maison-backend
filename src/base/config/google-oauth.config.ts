import { registerAs } from '@nestjs/config';

export interface GoogleOAuthConfigOptions {
  client_id: string;
  client_secret: string;
  grant_type: 'authorization_code';
  redirect_uri: string;
}

export const googleOauthConfig = registerAs(
  'google_oauth',
  (): GoogleOAuthConfigOptions => ({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI!,
    grant_type: 'authorization_code',
  }),
);
