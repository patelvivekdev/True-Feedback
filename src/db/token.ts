import 'server-only';

import { and, eq, lt } from 'drizzle-orm';
import { db } from '.';
import { verificationTokens } from './schema';

export const saveToken = async (username: string, token: string, expires: Date) => {
  const [verificationToken] = await db
    .insert(verificationTokens)
    .values({
      identifier: username,
      token,
      expires,
    })
    .returning();
  return verificationToken;
};

export const findToken = async (username: string, token: string) => {
  const [verificationToken] = await db
    .select()
    .from(verificationTokens)
    .where(and(eq(verificationTokens.identifier, username), eq(verificationTokens.token, token)));
  return verificationToken;
};

export const updateToken = async (username: string, token: string, expires: Date) => {
  const [verificationToken] = await db
    .update(verificationTokens)
    .set({
      token,
      expires,
    })
    .where(eq(verificationTokens.identifier, username))
    .returning();
  return verificationToken;
};

export const deleteExpiredTokens = async () => {
  const [tokens] = await db
    .delete(verificationTokens)
    .where(lt(verificationTokens.expires, new Date()))
    .returning();
  return tokens;
};

export const deleteToken = async (username: string, token: string) => {
  // deleteExpiredTokens
  deleteExpiredTokens();

  // Delete the token from the database

  const [verificationToken] = await db
    .delete(verificationTokens)
    .where(and(eq(verificationTokens.identifier, username), eq(verificationTokens.token, token)))
    .returning();
  return verificationToken;
};
