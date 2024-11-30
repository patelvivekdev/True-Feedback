'use server';
import { User } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { auth } from '@/app/auth';
import { findUserByUsername } from '@/db/user';
import { db } from '@/db';
import { messages } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export async function reFetchMessages() {
  revalidatePath('/dashboard');
}

export async function getMessages() {
  const session = await auth();
  const _user: User = session?.user;

  const userId = _user.id;
  if (!userId) {
    return {
      type: 'error',
      message: 'Not authenticated',
    };
  }

  const data = await db.select().from(messages).where(eq(messages.userId, userId));

  return {
    type: 'success',
    data,
  };
}

export async function sendMessage(username: string, content: string) {
  const data = await findUserByUsername(username);

  if (!data) {
    return {
      type: 'error',
      message: 'User not found',
    };
  }

  const userId = data.id;

  if (!data.isAcceptingMessages) {
    return {
      type: 'error',
      message: `${data.username} are not accepting messages at this time.`,
    };
  }

  // save new message
  const [id] = await db
    .insert(messages)
    .values({
      userId,
      content,
    })
    .returning({ id: messages.id });

  if (!id) {
    return {
      type: 'error',
      message: 'Failed to send message',
    };
  }

  revalidatePath('/dashboard');

  return {
    type: 'success',
    message: 'Message sent successfully',
  };
}

export async function deleteMessage(messageId: string) {
  const session = await auth();
  const _user: User = session?.user;

  const userId = _user.id;
  if (!userId) {
    return {
      type: 'error',
      message: 'Not authenticated',
    };
  }

  await db.delete(messages).where(and(eq(messages.id, messageId), eq(messages.userId, userId)));

  revalidatePath('/dashboard');

  return {
    type: 'success',
    message: 'Message deleted successfully',
  };
}
