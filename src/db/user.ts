import 'server-only';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { db } from '.';
import { users } from './schema';
import { and, eq, or } from 'drizzle-orm';

class InvalidTypeError extends AuthError {
  code = 'login-with-oauth';
}

export const checkUsername = async (username: string) => {
  const [user] = await db
    .select({
      username: users.username,
    })
    .from(users)
    .where(eq(users.username, username));
  return user;
};

export const findUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
};

export const getUserEmail = async (username: string) => {
  const [email] = await db
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.username, username));
  return email;
};

export const findUserById = async (id: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
};

export const findUserByUsername = async (username: string) => {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user;
};

export const findUserByUsernameOrEmail = async (username: string, email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)));

  return user;
};

export const findIfUserUsedOAuth = async (username: string) => {
  const [userId] = await db
    .select({
      userId: users.id,
    })
    .from(users)
    .where(and(eq(users.password, ''), eq(users.username, username)));
  return userId;
};

export const loginUser = async (identifier: string, password: string) => {
  // check if user is sign up with oauth
  const userId = await findIfUserUsedOAuth(identifier);

  if (userId) {
    throw new InvalidTypeError();
  }

  const data = await findUserByUsernameOrEmail(identifier, identifier);

  if (!data.password || !data.email) {
    return null;
  }
  const isValid = await bcrypt.compare(password, data.password);
  if (!isValid) {
    return null;
  }
  return data;
};

export const createUser = async (
  username: string,
  email: string,
  name: string,
  password: string,
) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({
      username,
      email,
      name,
      password: hashedPassword,
    })
    .returning();
  return user;
};

export const updateUser = async (
  username: string,
  data: {
    username?: string;
    email?: string;
    password?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
  },
) => {
  try {
    const [userId] = await db
      .update(users)
      .set(data)
      .where(eq(users.username, username))
      .returning({
        id: users.id,
      });
    return userId;
  } catch (error) {
    console.log(error);
  }
};
