'use server';
import { z } from 'zod';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { signUpSchema, usernameValidation } from '@/schemas/signUpSchema';
import { signInSchema } from '@/schemas/signInSchema';
import { CredentialsSignin, User } from 'next-auth';
import { signIn, signOut, auth, InvalidTypeError } from '@/app/auth';
import { checkUsername, createUser, findUserByUsernameOrEmail, updateUser } from '@/db/user';
import { revalidatePath } from 'next/cache';
import { findToken, saveToken, updateToken } from '@/db/token';

export async function SignIn() {
  await signIn('github', { redirectTo: '/dashboard' });
}

export async function SignOut() {
  await signOut();
}

export async function login(data: z.infer<typeof signInSchema>) {
  const validateFields = signInSchema.safeParse(data);
  if (!validateFields.success) {
    return {
      type: 'error',
      errors: validateFields.error.flatten().fieldErrors,
      message: 'Invalid fields',
    };
  }

  const { identifier, password } = validateFields.data;

  try {
    await signIn('credentials', {
      redirect: false,
      identifier,
      password,
    });
  } catch (error: unknown) {
    if (error instanceof CredentialsSignin) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            type: 'error',
            message: 'Invalid credentials',
          };
        default:
          return {
            type: 'error',
            message: 'Something went wrong',
          };
      }
    } else if (error instanceof InvalidTypeError) {
      return {
        type: 'error',
        message:
          'It looks like you signed up with a social account. Please sign in with the same method.',
      };
    } else {
      return {
        type: 'error',
        message: 'Something went wrong',
      };
    }
  }
}

export async function saveUser(data: z.infer<typeof signUpSchema>) {
  const { username, email, name, password } = data;

  const user = await findUserByUsernameOrEmail(username, email);

  if (user) {
    return {
      type: 'error',
      message: 'User already exists with this email',
    };
  }

  await createUser(username, email, name, password);

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 15);

  // save token to the verifyCode table
  const verificationToken = await saveToken(username, token, expires);

  if (!verificationToken) {
    return {
      type: 'error',
      message: 'Database Error: Failed to send verification token.',
    };
  }

  const emailResponse = await sendVerificationEmail(email, username, token);

  if (!emailResponse.success) {
    return {
      type: 'error',
      message: 'Failed to send verification email',
    };
  }

  return {
    type: 'success',
    message: 'User created successfully',
  };
}

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function checkUniqueEmail(username: string) {
  const validatedFields = UsernameQuerySchema.safeParse({
    username: username,
  });

  if (!validatedFields.success) {
    return {
      type: 'error',
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid username',
    };
  }

  try {
    const username = await checkUsername(validatedFields.data.username);
    if (username) {
      return {
        type: 'error',
        message: 'Username already exists',
      };
    }
    return {
      type: 'success',
      message: 'Username is available',
    };
  } catch (error) {
    console.error('Error checking username:', error);
    return {
      type: 'error',
      message: 'An error occurred while checking the username.',
    };
  }
}

export async function verifyCode(username: string, code: string) {
  const token = await findToken(username, code);
  if (!token) {
    return {
      type: 'error',
      message: 'User not found',
    };
  }

  // check the code and
  if (token.token !== code) {
    return {
      type: 'error',
      message: 'Invalid code',
    };
  }

  // expiration time
  if (new Date(token.expires) < new Date()) {
    return {
      type: 'error',
      message: 'Code expired',
    };
  }

  // update the user
  const user = await updateUser(username, { isVerified: true });

  if (user) {
    return {
      type: 'success',
      message: 'Email verified',
    };
  }

  return {
    type: 'error',
    message: 'Database Error: Failed to verify user.',
  };
}

export async function resendCode(email: string) {
  // get the username
  const user = await findUserByUsernameOrEmail(email, email);

  if (!user) {
    return {
      type: 'error',
      message: 'If the email is registered, you will receive a verification code.',
    };
  }

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 15);

  // update the user
  const verificationToken = await updateToken(user.username!, token, expires);

  if (!verificationToken) {
    return {
      type: 'error',
      message: 'If the email is registered, you will receive a verification code.',
    };
  }

  const emailResponse = await sendVerificationEmail(user.email!, user.username!, token);

  if (!emailResponse.success) {
    return {
      type: 'error',
      message: 'Please try again later',
    };
  }

  return {
    type: 'success',
    message: 'Code resent',
    username: user.username,
  };
}

export async function changeAcceptMessages(isAcceptingMessages: boolean) {
  const session = await auth();
  const _user: User = session?.user;

  if (!session || !_user) {
    return {
      type: 'error',
      message: 'Not authenticated',
    };
  }

  const username = _user.username;

  if (!username) {
    return {
      type: 'error',
      message: 'Not authenticated',
    };
  }

  const user = await updateUser(username, { isAcceptingMessages });

  if (!user) {
    return {
      type: 'error',
      message: 'Failed to update user',
    };
  } else {
    revalidatePath('/dashboard');
    return {
      type: 'success',
      message: 'Setting updated successfully',
    };
  }
}
